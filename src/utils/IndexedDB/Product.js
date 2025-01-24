import short from 'short-uuid'
import IDBStoreOperator from "./IDBStoreOperator"

export default class Product extends IDBStoreOperator {
  constructor({ db, storeName='product' }={}) {
    super({ db, storeName })
  }

  create(data) {
    const id = short.generate()

    return super.create({
      id,
      ...data,
    })
  }

  queryByCreatedTime({
    next=null,
    limit=Infinity,
    order='prev', // next/prev/nextunique/prevunique
  }={}) {
    const { db, storeName } = this
    const items = []
    let startFrom = next ? atob(next) : null

    return new Promise((resolve, reject) => {
      const request = db.transaction(storeName)
        .objectStore(storeName)
        .index('byCreatedTime')
        .openCursor(null, order)

      request.onsuccess = (event) => {
        const cursor = event.target.result

        if (cursor) {
          const item = cursor.value
          const itemId = item.id

          if (startFrom && startFrom === itemId) {
            startFrom = null
          } else if (!startFrom) {
            items.push(item)

            if (items.length >= limit) {
              return resolve({
                items,
                next: btoa(itemId),
              })
            }
          }

          cursor.continue()
        } else {
          resolve({
            items,
            next: null,
          })
        }
      }
      request.onerror = (event) => reject(event.target.error)
    })
  }
}