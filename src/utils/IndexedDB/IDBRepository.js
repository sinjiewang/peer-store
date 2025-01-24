import File from "./File.js"
import Product from './Product.js'

export default class IDBRepository {
  constructor({ storeId='guest' }={}) {
    this.version = 5
    this.storeId = storeId
    this.db = null
    this.$fileStore = null
  }

  get dbName() {
    return this.storeId
  }

  get storeConfigure() {
    return {
      // account: {
      //   options: { keyPath: 'id' },
      // },
      // history: {
      //   options: { keyPath: 'id' },
      //   indexes: [
      //     {
      //       indexName: 'byAction',
      //       keyPath: 'action',
      //       options: { unique: false },
      //     },
      //     {
      //       indexName: 'byUpdatedTime',
      //       keyPath: 'updatedTime',
      //       options: { unique: false },
      //     },
      //   ]
      // },
      // chat: {
      //   options: {
      //     keyPath: 'id',
      //     autoIncrement: true,
      //   },
      //   indexes: [
      //     {
      //       indexName: 'byHistoryId',
      //       keyPath: 'historyId',
      //       options: { unique: false },
      //     },
      //   ],
      // },
      // post: {
      //   options: {
      //     keyPath: 'id',
      //   },
      //   indexes: [
      //     {
      //       indexName: 'byHistoryId',
      //       keyPath: 'historyId',
      //       options: { unique: false },
      //     },
      //   ],
      // },
      // comment: {
      //   options: {
      //     keyPath: 'id',
      //   },
      //   indexes: [
      //     {
      //       indexName: 'byPostId',
      //       keyPath: 'postId',
      //       options: { unique: false },
      //     },
      //   ],
      // },
      file: {
        options: { keyPath: 'id' },
        indexes: [
          {
            indexName: 'byUpdatedTime',
            keyPath: 'updatedTime',
            options: { unique: false },
          },
        ]
      },
      product: {
        options: { keyPath: 'id' },
        indexes: [
          {
            indexName: 'byCreatedTime',
            keyPath: 'createdTime',
            options: { unique: false },
          },
          {
            indexName: 'byUpdatedTime',
            keyPath: 'updatedTime',
            options: { unique: false },
          },
        ]
      },
    }
  }

  async connect() {
    const { dbName, version } = this
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version)

      request.onupgradeneeded = (event) => this.onupgradeneeded(event)
      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event)
    })

    this.db = db
    this.$productStore = new Product({ db })
    this.$fileStore = new File({ db })

    return this
  }

  close() {
    this.db?.close()
    this.bd = null
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

  async createImage(data) {
    return this.$fileStore?.create(data)
  }
}