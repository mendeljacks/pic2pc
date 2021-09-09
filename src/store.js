import { action, makeAutoObservable, runInAction } from 'mobx'
import { setup_async_loaders } from './async_loaders'
import axios from 'axios'
import d from 'lodash.debounce'

export const handle_update_gallery_id = action(e => {
    store.gallery_id = e.target.value
    fetch_pictures_by_gallery_id(store.gallery_id)
})

const fetch_pictures_by_gallery_id = d(async gallery_id => {
    console.log('fetching')
    const pictures = await axios.get(`http://localhost:3004/gallery?gallery_id=${gallery_id}`)
    runInAction(() => (store.pictures = pictures.data))
}, 500)

const socket = new WebSocket('ws://localhost:3004')
socket.addEventListener('open', event => {
    console.log('connected')
    fetch_pictures_by_gallery_id(store.gallery_id)
})
socket.addEventListener('message', event => {
    console.log('message from server', event)
    fetch_pictures_by_gallery_id(store.gallery_id)
})

class Store {
    constructor() {
        setup_async_loaders(this)
        makeAutoObservable(this)
    }

    gallery_id = Date.now().toString(36)
    pictures = []

    ws_send = async body => {
        socket.send(JSON.stringify(body))
    }

    copy_image_to_clipboard = async () => {
        // @return Promise<boolean>
        async function askWritePermission() {
            try {
                // The clipboard-write permission is granted automatically to pages
                // when they are the active tab. So it's not required, but it's more safe.
                const { state } = await navigator.permissions.query({ name: 'clipboard-write' })
                return state === 'granted'
            } catch (error) {
                // Browser compatibility / Security error (ONLY HTTPS) ...
                return false
            }
        }

        // @params blob - The ClipboardItem takes an object with the MIME type as key, and the actual blob as the value.
        // @return Promise<void>
        const setToClipboard = async blob => {
            const data = [new window.ClipboardItem({ [blob.type]: blob })]
            await navigator.clipboard.write(data)
        }

        // Can we copy a text or an image ?
        const canWriteToClipboard = await askWritePermission()

        function dataURItoBlob(dataURI, callback) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);
        
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        
            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
        
            // write the ArrayBuffer to a blob, and you're done
            var bb = new Blob([ab], {type: mimeString});
            return bb;
        }


        // Copy a PNG image to clipboard
        if (canWriteToClipboard) {
            const url = document.querySelector('img').src
            const blob = dataURItoBlob(url)
            await setToClipboard(blob)
        }

      
    }
}

export const store = (window.store = new Store())
