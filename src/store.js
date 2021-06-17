import { makeAutoObservable } from "mobx"
import { setup_async_loaders } from "./async_loaders"

class Store {
    constructor() {
        setup_async_loaders(this)
        makeAutoObservable(this)
    }

    bin_name = Date.now().toString(36)
    files = []

    upload = async () => {

    }
}

export const store = window.store = new Store()