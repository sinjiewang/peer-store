import Cart from './Cart.js'
import File from "./File.js"
import Product from './Product.js'

import { Config as CartTableConfig } from './Cart.js'
import { Config as FileTableConfig } from './File.js'
import { Config as ProductTableConfig } from './Product.js'

const CACHE_TIMEOUT = import.meta.env.VITE_INDEXEDDB_CACHE_TIMEOUT

export default class IDBRepository {
  constructor({ storeId='guest' }={}) {
    this.version = 6
    this.storeId = storeId
    this.db = null
    this.$productStore = null
    this.$fileStore = null
  }

  get dbName() {
    return this.storeId
  }

  get storeConfigure() {
    const guestDBConfig = {
      file: FileTableConfig,
      cart: CartTableConfig,
    }
    const storeDBConfig = {
      file: FileTableConfig,
      product: ProductTableConfig,
    }

    return this.storeId === 'guest' ? guestDBConfig : storeDBConfig
  }

  async connect() {
    const { dbName, version, storeId } = this
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version)

      request.onupgradeneeded = (event) => this.onupgradeneeded(event)
      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event)
    })

    this.db = db
    this.$productStore = new Product({ db })
    this.$fileStore = new File({ db })
    this.$cartStore = new Cart({ db })

    if (storeId === 'guest') {
      this.$fileStore
        .getAll()
        .then(({ items }) => {
          const expireTime = Date.now() - Number(CACHE_TIMEOUT)

          items.filter((item) => item.createdTime < expireTime)
            .forEach((item) => this.$fileStore.delete(item.id))
        })
    }

    return this
  }

  close() {
    this.db?.close()
    this.db = null
    this.$productStore = null
    this.$fileStore = null
  }

  onupgradeneeded(event) {
    const db = event.target.result
    const { storeConfigure } = this

    Object.keys(storeConfigure).forEach((storeName) => {
      const { options, indexes } = storeConfigure[storeName]
      let store

      if (!db.objectStoreNames.contains(storeName)) {
        store = db.createObjectStore(storeName, options)
      } else {
        store = event.target.transaction.objectStore(storeName)
      }

      if (indexes && indexes.length) {
        indexes.forEach(({indexName, keyPath, options}) => {
          if (!store.indexNames.contains(indexName)) {
            store.createIndex(indexName, keyPath, options)
          }
        })
      }
    })
  }

  async listProducts({ next, limit, order }={}) {
    return this.$productStore?.queryByCreatedTime({ next, limit, order })
  }

  async getProduct(id) {
    return this.$productStore?.queryById(id)
  }

  async createProduct(data) {
    return this.$productStore?.create(data)
  }

  async updateProduct(id, data) {
    return this.$productStore?.update(id, data)
  }

  async deleteProduct(id) {
    return this.$productStore?.delete(id)
  }

  async createImage(file, options={}) {
    return this.$fileStore?.createImage(file, options)
  }

  async deleteImage(id) {
    return this.$fileStore?.deleteImage(id)
  }

  async createFile(data) {
    return this.$fileStore?.create(data)
  }

  async getFile(id) {
    return this.$fileStore?.queryById(id)
  }

  async getFile(id) {
    return this.$fileStore?.queryById(id)
  }

  async createCart(data) {
    return this.$cartStore.create(data)
  }

  async updateCart(id, data) {
    return this.$cartStore.update(id, data)
  }

  async deleteCart(id) {
    return this.$cartStore.delete(id)
  }

  async queryCartByProductId(productId) {
    return this.$cartStore.queryByProductId({ productId })
  }

  async queryCartByStoreId(storeId) {
    return this.$cartStore.queryByStoreId({ storeId })
  }
}