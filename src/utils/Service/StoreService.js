import EventEmitter from 'events'
import Server from './Server.js'
import Protocol from './Protocol.js'

export default class StoreService extends EventEmitter {
  constructor({ storeId, tunnel }) {
    super()

    this.connections = {}
    this.server = new Server({ storeId, tunnel })
    this.server.on('connect', (event) => this.onconnect(event))
    this.server.on('disconnect', (event) => this.ondisconnect(event))
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

    console.log('onrequest', clientId, messageId, action, payload)

    switch (action) {
      default:
        return connection.sendReject(messageId)
    }
  }

  destroy() {
    this.server.close()
    this.server = null
  }
}
