import EventEmitter from 'events'
import ClientSignaling from '@/utils/Signaling/ClientSignaling.js'
import RTCPeerClient from '@/utils/RTCPeer/RTCPeerClient.js'

export default class Client extends EventEmitter {
  constructor({ storeId='' }={}) {
    super();

    this.rtcClient = null
    this.dataChannel = null
    this.storeId = storeId
  }

  async connect({ tunnel }={}) {
    const { storeId } = this
    const signaling = new ClientSignaling({ tunnel })
    const rtcClient = new RTCPeerClient({
      signaling,
      storeId,
    })

    await rtcClient.connect()

    const dataChannel = await rtcClient.createDataChannel('data', { ordered: true })

    dataChannel.on('close', () => this.onclose())

    this.dataChannel = dataChannel
    this.rtcClient = rtcClient

    return dataChannel
  }

  onclose() {
    this.dataChannel = null

    console.warn('datachannel disconnect')
  }

  close() {
    this.rtcClient?.close()
    this.rtcClient = null
  }
}
