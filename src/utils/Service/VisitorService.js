import EventEmitter from 'events'
import Server from './Client.js'
import Protocol from './Protocol.js'

export default class VisitorService extends EventEmitter {
  constructor({ storeId }={}) {
    super()

    this.storeId = storeId
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

  async listProducts(payload={}) {
    const res = await this.channel.sendRequest({
      action: 'listProducts',
      payload,
    })

    return JSON.parse(res)
  }
}
