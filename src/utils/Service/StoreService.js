import EventEmitter from 'events'
import Protocol from './Protocol.js'

export default class StoreService extends EventEmitter {
  constructor({ server, repository, watermark, storeInfo }={}) {
    super()

    this.connections = {}
    this.server = null
    this.repository = repository
    this.watermark = watermark
    this.info = storeInfo // { id, name, email, phone, address, position }

    this.$onconnect = (event) => this.onconnect(event)
    this.$ondisconnect = (event) => this.ondisconnect(event)

    if (server) this.setServer(server)
  }

  setServer(server) {
    if (this.server) this.removeServer()

    this.server = server
    this.server.on('connect', this.$onconnect)
    this.server.on('disconnect', this.$ondisconnect)
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

        console.log(response)

        return connection.sendResponse(messageId, response)
      case 'image':
        try {
          response = await this.getImage(payload.id)

          return connection.sendResponse(messageId, response)
        } catch (err) {
          console.warn('getImage failed', payload.id)
        }
      default:
        return connection.sendReject(messageId)
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
}
