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
}

export const store = (window.store = new Store())
