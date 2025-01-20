import EventEmitter from 'events'
import { clearTimeout, setTimeout } from 'worker-timers'

const KEEPALIVE_TIMEOUT = 1000 * 60 * 9 // 9 min
const WS_READY_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}

export default class APIGatewayConnection extends EventEmitter {
  _timeout
  _promise
  _resolve
  _reject

  constructor({ url='', protocol, genToken }={}) {
    super()

    this.url = url
    this.protocol = protocol
    this.genToken = genToken || function() { return {} }
    this.websocket = null
    this.id = (Math.random() + 1).toString(36).substr(4)
  }

  get connected() {
    const { websocket } = this

    return websocket && websocket.readyState === WS_READY_STATE.OPEN
  }

  bindEvent() {
    const { websocket } = this

    if (websocket) {
      this.$onopen = this.onopen.bind(this)
      this.$onclose = this.onclose.bind(this)
      this.$onerror = this.onerror.bind(this)
      this.$onmessage = this.onmessage.bind(this)
      websocket.onopen = this.$onopen
      websocket.onclose = this.$onclose
      websocket.onerror = this.$onerror
      websocket.onmessage = this.$onmessage
    }
  }

  unbindEvent() {
    const { websocket } = this

    if (websocket) {
      websocket.onopen = null
      websocket.onclose = null
      websocket.onerror = null
      websocket.onmessage = null
      this.$onopen = null
      this.$onclose = null
      this.$onerror = null
      this.$onmessage = null
    }
  }

  async connect() {
    if (this._promise) {
      return this._promise
    } else if (this.connected) {
      return Promise.resolve()
    }

    this._promise = new Promise(async (resolve, reject) => {
      this._resolve = resolve
      this._reject = reject

      const { url, protocol, genToken } = this
      const token = await genToken()
      const params = new URLSearchParams(token).toString()

      this.websocket = new WebSocket(`${url}?${params}`, protocol)
      this.bindEvent()
    }).then(() => {
      this.keepAlive()
    }).finally(() => {
      this._resolve = null
      this._reject = null
      this._promise = null
    })

    return this._promise
  }

  disconnect() {
    const { websocket } = this

    if (this._reject) this._reject(new Error('WebSocket disconnect manually'))

    this.unbindEvent()
    this.websocket = null
    this.clearKeepAlive()

    websocket?.close()
  }

  reconnect() {
    this._timeout = setTimeout(() => this.connect(), 5000)
  }

  async send(message) {
    if (this.connected) {
      this.websocket.send(JSON.stringify(message))
      this.keepAlive()
    } else {
      console.error('WebSocket disconnect', this.url)

      throw new Error('WebSocket disconnect')
    }
  }

  keepAlive() {
    this.clearKeepAlive()

    if (this.connected) {
      this._timeout = setTimeout(() => this.send({
        action: 'keep-alive',
      }), KEEPALIVE_TIMEOUT)
    }
  }

  clearKeepAlive() {
    if (this._timeout) {
      clearTimeout(this._timeout)

      this._timeout = null
    }
  }

  onmessage(event) {
    const { action, type, data } = JSON.parse(event.data)

    if (type) {
      this.emit(type, { action, type, data })
    }

    this.emit('message', event)
  }

  onerror(event) {
    if (this._reject) {
      console.error("WebSocket error: ", event)

      this._reject(event)
    }

    this.disconnect()
    this.emit('error', event)
  }

  onopen() {
    if (this._resolve) this._resolve()

    this.emit('open', event)
  }

  onclose() {
    console.warn('WebSocket disconnected from the remote server')

    this.disconnect()
    this.reconnect()

    this.emit('close', event)
  }
}
