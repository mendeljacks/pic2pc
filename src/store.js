import { makeAutoObservable } from "mobx"
import { setup_async_loaders } from "./async_loaders"

const socket = new WebSocket('ws://localhost:3004')
socket.addEventListener('open', (event) => {
    console.log('connected')
})
socket.addEventListener('message', (event) => {
    console.log('message from server', event)
})

class Store {
    constructor() {
        setup_async_loaders(this)
        makeAutoObservable(this)

    }

    gallery_name = Date.now().toString(36)
    pictures = []
    files = [] // pending upload

    upload = async () => {
        socket.send('hello from client')
    }
}

export const store = window.store = new Store()