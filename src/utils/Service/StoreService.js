import EventEmitter from 'events'
import Protocol from './Protocol.js'
import roundTo from '@/utils/roundTo.js'

const ORDER_EXPIRT = 1000 * 60 * 10

export default class StoreService extends EventEmitter {
  constructor({ server, repository, watermark, storeInfo, createOrderFromCloud }={}) {
    super()

    this.connections = {}
    this.server = null
    this.repository = repository
    this.watermark = watermark
    this.info = storeInfo // { id, name, email, phone, address, position }
    this.createOrderFromCloud = createOrderFromCloud || function () {return Promise.reject(new Error('GraphQL unset'))}

    this.$onconnect = (event) => this.onconnect(event)
    this.$ondisconnect = (event) => this.ondisconnect(event)
    this.$onpayment = (event) => this.onpayment(event)

    if (server) this.setServer(server)
  }

  setServer(server) {
    if (this.server) this.removeServer()

    this.server = server
    this.server.on('connect', this.$onconnect)
    this.server.on('disconnect', this.$ondisconnect)
    this.server.on('payment', this.$onpayment)
  }

  removeServer() {
    const { server } = this

    server?.off('connect', this.$onconnect)
    server?.off('disconnect', this.$ondisconnect)

    this.server = null

    return server
  }

  onconnect({ clientId, dataChannel }) {
    const connection = new Protocol({ clientId, dataChannel })

    connection.on('message', (event) => this.onmessage(event))
    connection.on('request', (event) => this.onrequest(event))

    this.connections[clientId] = connection
    this.emit('connect', { clientId, dataChannel })
  }

  ondisconnect({ clientId }) {
    const connection = this.connections[clientId]

    if (connection) {
      delete this.connections[clientId]
    }
  }

  onpayment(event) {
    console.log('onpayment', event)
  }

  onmessage(event) {
    const { clientId, data } = event

    console.log('onmessage', clientId, data)
  }

  async onrequest(event) {
    const { clientId, messageId, action, payload } = event
    const connection = this.connections[clientId]
    let response

    console.log('onrequest', clientId, messageId, action, payload)

    switch (action) {
      case 'info':
        return connection.sendResponse(messageId, this.info)
      case 'listProducts':
        response = await this.listProducts(payload)

        return connection.sendResponse(messageId, response)
      case 'image':
        try {
          response = await this.getImage(payload.id)

          return connection.sendResponse(messageId, response)
        } catch (err) {
          console.warn('getImage failed', payload.id)
        }
      case 'order':
        try {
          const order = await this.createOrder(payload.items)

          return connection.sendResponse(messageId, { orderId: order.id })
        } catch (err) {
          return connection.sendReject(messageId, 422, err.message)
        }
      default:
        return connection.sendReject(messageId)
    }
  }

  onpayment(data={}) {
    console.log('onpayment', data)

    const { orderDetail, orderStatus } = data // { orderId, orderDetail, orderStatus, billingId, tradeNo }
    const detail = JSON.parse(orderDetail)

    if (orderStatus === 'PAID') {
      detail.forEach(async ({ id, quantity }) => {
        const item = await this.getProduct(id)

        if (item.quantity !== 'Infinity') {
          item.quantity = Math.max((item.quantity - quantity), 0)
        }

        await this.updateProduct(id, item)
      })
    }
  }

  destroy() {
    this.server?.close()
    this.server = null
    this.repository?.close()
    this.repository = null
  }

  async listProducts(data) {
    return this.repository.listProducts(data)
  }

  async getProduct(id) {
    return this.repository.getProduct(id)
  }

  async createProduct(data) {
    return this.repository.createProduct(data)
  }

  async updateProduct(id, data) {
    return this.repository.updateProduct(id, data)
  }

  deleteProduct(id) {
    return this.repository.deleteProduct(id)
  }

  async createImage(file) {
    const { watermark } = this

    return this.repository.createImage(file, { watermark })
  }

  async getImage(id) {
    return this.repository.getFile(id)
  }

  async deleteImage(id) {
    return this.repository.deleteImage(id)
  }

  async createOrder(items=[]) {
    const products = await Promise.all(items.map((item) => this.getProduct(item.id)))
    const errors = products.reduce((acc, curr, index) => {
        if (!curr || (curr.quantity !== 'Infinity' && curr.quantity < items[index].count)) {
          acc.push({
            id: curr.id,
            message: 'quantity error',
            remaining: curr?.quantity || 0,
          })
        }
        return acc
      }, [])

    if (errors.length) {
      throw new Error(JSON.stringify({ errors }))
    }

    const totalAmount = roundTo(products.reduce((acc, curr, index) => acc + items[index].count * Number(curr.price), 0))
    const detail = products.map(({ id, name, price, sku, gui }, index) => ({
      id, name, price, sku, gui,
      quantity: items[index].count,
    }))
    // const expired = new Date(Date.now() + ORDER_EXPIRT).toISOString()
    const storeId = this.info.id
    const order = {
      storeId,
      totalAmount,
      detail: JSON.stringify(detail),
      status: 'PENDING',
      // expired,
    }
    const { data } = await this.createOrderFromCloud(order)

    return data.createOrder
  }
}
