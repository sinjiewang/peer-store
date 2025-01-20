import EventEmitter from 'events'
import Server from './Client.js'
import Protocol from './Protocol.js'

export default class VisitorService extends EventEmitter {
  constructor() {
    super()

    this.server = new Server()
    this.channel = null
    this.$onmessage = (data) => this.onmessage(data)
    this.$onclose = () => this.onclose()
  }

  async connect({ storeId, tunnel }) {
    const dataChannel = await this.server.connect({ storeId, tunnel })
    const channel = new Protocol({ dataChannel })

    channel.on('message', this.$onmessage)
    channel.on('close', this.$onclose)

    this.channel = channel
  }

  onmessage(event) {
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

  sendMessage(data) {
    this.channel.send({
      type: 'message',
      data,
    })
  }
}
