import EventEmitter from 'events'

export default class Signaling extends EventEmitter {
  static getIceServers = () => Promise.reject('get ice servers fail')

  constructor({ tunnel }={}) {
    super()

    this.tunnel = tunnel
    this.$onmessage = this.onmessage.bind(this)
    this.tunnel.on('message', this.$onmessage)
  }

  onmessage(event) {
    const { action, data, clientId, storeId, error } = JSON.parse(event.data)

    if (error) {
      return this.emit('error', error)
    }

    if (['offer', 'answer', 'icecand'].includes(action)) {
      const emitData = {
        desc: data,
      }

      if (clientId) {
        emitData.clientId = clientId
      } else if (storeId) {
        emitData.storeId = storeId
      }

      this.emit(action, emitData)
    } else {
      this.emit(action, data)
    }
  }

  sendIceServers() {
    this.tunnel.send({
      action: 'iceServers',
    })
  }

  destroy() {
    this.tunnel.off('message', this.$onmessage)
    this.tunnel = null
  }
}
