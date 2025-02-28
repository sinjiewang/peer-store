import EventEmitter from 'events'
import Server from './Client.js'
import Protocol from './Protocol.js'

export default class VisitorService extends EventEmitter {
  constructor({ storeId, repository }={}) {
    super()

    this.storeId = storeId
    this.repository = repository
    this.server = new Server({ storeId })
    this.channel = null
    this.$onmessage = (data) => this.onmessage(data)
    this.$onclose = () => this.onclose()
  }

  async connect({ tunnel }) {
    const { storeId } = this
    const dataChannel = await this.server.connect({ storeId, tunnel })
    const channel = new Protocol({ dataChannel })

    channel.on('message', this.$onmessage)
    channel.on('close', this.$onclose)

    this.channel = channel
  }

  onmessage(event) {
    const { clientId, data } = event

    console.log('onmessage', clientId, data)
  }

  onclose() {
    this.channel.off('message', this.$onmessage)
    this.channel.off('close', this.$onclose)
    this.channel = null
    this.destroy()
    this.emit('close')
  }

  destroy() {
    this.server.close()
    this.server = null
  }

  // sendMessage(data) {
  //   this.channel.send({
  //     type: 'message',
  //     data,
  //   })
  // }

  async getStoreInfo() {
    const res = await this.channel.sendRequest({
      action: 'info',
    })

    return JSON.parse(res)
  }

  async listProducts({ limit, next }={}) {
    const res = await this.channel.sendRequest({
      action: 'listProducts',
      payload: { limit, next },
    })

    return JSON.parse(res)
  }

  async getImage(id) {
    const image = await this.repository.getFile(id)

    if (image) return image

    const res = await this.channel.sendRequest({
      action: 'image',
      payload: { id },
    })
    const data = JSON.parse(res)

    this.repository.createFile(data)

    return data
  }

  async increaseToCart(data) {
    const { productId } = data
    const { items } = await this.getCartItemsByProductId(productId)
    let item

    if (items.length) {
      item = items.pop()

      item.count += 1

      this.updateCart(item.id, item)

      return item
    } else {
      return this.createCart({
        ...data,
        count: 1,
      })
    }
  }

  async decreaseFromCart({ productId }) {
    const { items } = await this.getCartItemsByProductId(productId)
    let item

    if (items.length) {
      item = items.pop()
      item.count -= 1

      if (item.count) await this.updateCart(item.id, item)
      else await this.deleteCart(item.id)

      return item
    }

    return null
  }

  async createCart(data) {
    return this.repository.createCart(data)
  }

  async updateCart(id, data) {
    return this.repository.updateCart(id, data)
  }

  async deleteCart(id) {
    return this.repository.deleteCart(id)
  }

  async getCartItemsByProductId(productId) {
    try {
      return this.repository.queryCartByProductId(productId)
    } catch (err) {
      console.warn('repository.queryByProductId failed', err)
    }

    return { items: [], next: null}
  }

  async getCartItemsByStoreId(storeId) {
    try {
      return this.repository.queryCartByStoreId(storeId)
    } catch (err) {
      console.warn('repository.queryByStoreId failed', err)
    }

    return { items: [], next: null}
  }

  async createOrder(items=[]) {
    try {
      const res = await this.channel.sendRequest({
        action: 'order',
        payload: { items },
      })

      return JSON.parse(res)
    } catch (err) {
      console.warn('createOrder failed', err)

      return JSON.parse(err.message)
    }
  }
}
