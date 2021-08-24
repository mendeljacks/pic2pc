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

    copy_image_to_clipboard = () => {
        //Cross-browser function to select content
// function SelectText(element) {
//     var doc = document;
//     if (doc.body.createTextRange) {
//       var range = document.body.createTextRange();
//       range.moveToElementText(element);
//       range.select();
//     } else if (window.getSelection) {
//       var selection = window.getSelection();
//       var range = document.createRange();
//       range.selectNodeContents(element);
//       selection.removeAllRanges();
//       selection.addRange(range);
//     }
//   }
//   $(".copyable").click(function(e) {
//     //Make the container Div contenteditable
//     $(this).attr("contenteditable", true);
//     //Select the image
//     SelectText($(this).get(0));
//     //Execute copy Command
//     //Note: This will ONLY work directly inside a click listenner
//     document.execCommand('copy');
//     //Unselect the content
//     window.getSelection().removeAllRanges();
//     //Make the container Div uneditable again
//     $(this).removeAttr("contenteditable");
//     //Success!!
//     alert("image copied!");
//   });
    }
}

export const store = (window.store = new Store())
