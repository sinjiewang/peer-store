export default class IDBStoreOperator {
  constructor({ db, storeName }={}) {
    this.db = db
    this.storeName = storeName
  }

  create(data) {
    const { db, storeName } = this

    if (!db) {
      return Promise.reject(new Error('Database not opened.'))
    }

    return new Promise((resolve, reject) => {
      const createdTime = Date.now()
      const addData = {
        ...data,
        createdTime,
        updatedTime: createdTime,
      }
      const request = db.transaction([storeName], "readwrite")
        .objectStore(storeName)
        .add(addData)

      request.onsuccess = (event) => resolve({
        ...addData,
        id: event.target.result,
      })
      request.onerror = (event) => reject(event.target.error)
    })
  }

  queryById(id) {
    const { db, storeName } = this

    if (!db) {
      return Promise.reject(new Error('Database not opened.'))
    }

    return new Promise((resolve, reject) => {
      const request = db.transaction([storeName])
        .objectStore(storeName)
        .get(id)

      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event.target.error)
    })
  }

  async update(id, data) {
    const { db, storeName } = this

    if (!db) {
      return Promise.reject(new Error('Database not opened.'))
    }

    return this.queryById(id)
      .then((item) => new Promise((resolve, reject) => {
        const putItem = {
          ...item,
          ...data,
          createdTime: item.createdTime,
          updatedTime: Date.now(),
        }
        const request = db.transaction([storeName], "readwrite")
          .objectStore(storeName)
          .put(putItem)

        request.onsuccess = () => resolve(putItem)
        request.onerror = (event) => reject(event.target.error)
      }))
  }

  delete(id) {
    const { db, storeName } = this

    if (!db) {
      return Promise.reject(new Error('Database not opened.'))
    }

    return new Promise((resolve, reject) => {
      const request = db.transaction([storeName], "readwrite")
        .objectStore(storeName)
        .delete(id)

      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => reject(event.target.error)
    })
  }
}