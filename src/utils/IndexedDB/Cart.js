import IDBStoreOperator from "./IDBStoreOperator"

export const Config = {
  options: {
    keyPath: 'id',
    autoIncrement: true,
  },
  indexes: [
    {
      indexName: 'byStoreId',
      keyPath: 'storeId',
      options: { unique: false },
    },
    {
      indexName: 'byProductId',
      keyPath: 'productId',
      options: { unique: false },
    },
  ],
}

export default class Cart extends IDBStoreOperator {
  constructor({ db, storeName='cart' }={}) {
    super({ db, storeName })
  }

  async queryByStoreId({
    next=null,
    limit=Infinity,
    order='prev', // next/prev/nextunique/prevunique
    storeId,
  }={}) {
    return this.queryByConditions({
      next, limit, order,
      condition: {
        index: 'byStoreId',
        value: storeId,
      }
    })
  }

  async queryByProductId({
    next=null,
    limit=Infinity,
    order='prev', // next/prev/nextunique/prevunique
    productId,
  }={}) {
    return this.queryByConditions({
      next, limit, order,
      condition: {
        index: 'byProductId',
        value: productId,
      }
    })
  }

  async queryByConditions({
    next=null,
    limit=Infinity,
    order='prev', // next/prev/nextunique/prevunique
    condition={}
  }={}) {
    const { db, storeName } = this
    const items = []
    let startFrom = next ? atob(next) : null
    const { index, value } = condition

    return new Promise((resolve, reject) => {
      const range = IDBKeyRange.only(value)
      const request = db.transaction(storeName)
        .objectStore(storeName)
        .index(index)
        .openCursor(range, order)

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