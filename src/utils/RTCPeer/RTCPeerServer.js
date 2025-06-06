import EventEmitter from 'events';
import DataChannelWrapper from './DataChannelWrapper';
import { getTagged } from '../logger';

const Log = getTagged('connection:rtc-client');

export default class RTCPeerServer extends EventEmitter {
  constructor({ signaling }) {
    super();
    this.peerConnectionMap = {};
    this.$iceBufferMap = {};
    this.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

    if (signaling) {
      this.setSignaling(signaling);
    }
  }

  setSignaling(signaling) {
    if (this.signaling) {
      this.signaling.off('iceServers', this.$updateIceServers);
      this.signaling.off('offer', this.$createPeerConnection);
      this.signaling.off('icecand', this.$addIceCandidate);
    }

    this.$createPeerConnection = this.createPeerConnection.bind(this);
    this.$addIceCandidate = this.addIceCandidate.bind(this);
    this.$updateIceServers = this.updateIceServers.bind(this);
    this.signaling = signaling;

    signaling.on('iceServers', this.$updateIceServers);
    signaling.on('offer', this.$createPeerConnection);
    signaling.on('icecand', this.$addIceCandidate);

    setTimeout(() => signaling.sendIceServers(), 1000);
  }

  async createPeerConnection({
    // iceServers = [{ urls: 'stun:stun.l.google.com:19302' }],
    clientId, desc,
  }) {
    const { signaling, peerConnectionMap, iceServers } = this;
    const peerConnection = new RTCPeerConnection({ iceServers }, { optional: [] });

    if (peerConnectionMap[clientId]) {
      peerConnectionMap[clientId].close();
    }

    peerConnection.onicecandidate = ({ candidate }) => {
      signaling.sendIcecand({
        clientId,
        candidate,
      });
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (['failed', 'disconnected', 'closed'].includes(peerConnection.iceConnectionState)) {
        console.error('WebRTC disconnect', clientId);
        // Handle the failure
        const { channels } = peerConnectionMap[clientId];

        if (channels) {
          Object.keys(channels).forEach((label) => {
            channels[label].removeAllListeners();
          });

          delete peerConnectionMap[clientId];

          this.emit('disconnect', { clientId });
        }
      }
    };

    peerConnection.ondatachannel = (event) => {
      const dataChannel = new DataChannelWrapper(event.channel);
      const { label } = event.channel;
      if (peerConnection.channels) {
        peerConnection.channels[dataChannel.label] = dataChannel
      } else {
        peerConnection.channels = {
          [label]: dataChannel,
        }
      }

      this.emit('connect', { clientId });
    };

    await peerConnection.setRemoteDescription(desc);

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer);

    signaling.sendAnswer({ clientId, desc: answer });

    peerConnectionMap[clientId] = peerConnection;

    if (this.$iceBufferMap[clientId]) {
      this.$iceBufferMap[clientId]
        .forEach((desc) => this.addIceCandidate({ clientId, desc }));
      delete this.$iceBufferMap[clientId];
    }
  }

  getPeerConnection(clientId) {
    return this.peerConnectionMap[clientId];
  }

  addIceCandidate({ clientId, desc }) {
    const { peerConnectionMap, $iceBufferMap } = this;
    const peerConnection = peerConnectionMap[clientId];
    const iceBuffer = $iceBufferMap[clientId];

    if (peerConnection instanceof RTCPeerConnection) {
      peerConnection.addIceCandidate(desc);
    } else if (iceBuffer) {
      iceBuffer.push(desc);
    } else {
      $iceBufferMap[clientId] = [desc];
    }
  }

  async createDataChannel({ clientId, label, options = { /* ordered: true */ }}={}) {
    const { peerConnectionMap } = this;
    const peerConnection = peerConnectionMap[clientId];

    if (!peerConnection) {
      return Promise.reject(new Error('WebRTC disconnect'));
    }

    if (peerConnection.channels[label]) {
      return Promise.resolve(peerConnection.channels[label]);
    }

    return new Promise((resolve) => {
      const channel = new DataChannelWrapper(peerConnection.createDataChannel(label, options));
      channel.createTime = new Date().getTime();
      channel.on('open', () => {
        channel.openedTime = new Date().getTime() - channel.createTime;
        Log.log(`Data channel: ${label} opened in ${channel.openedTime} ms.`);
        peerConnection.channels[label] = channel;

        resolve(channel);
      });
      channel.on('close', () => {
        if (peerConnection.channels[label]) {
          Log.warn(`Data channel: ${label} closed. Trying to close session: ${channel.sessionId}`);

          delete peerConnection.channels[label];
        }
      });
    });
  }

  updateIceServers({ iceServers=[], expireTime=0 }) {
    const next = expireTime - Date.now() - 10;

    this.iceServers = iceServers;

    if (this.$timeout) {
      clearTimeout(this.$timeout);
    }

    this.$timeout = setTimeout(() => this.signaling.sendIceServers(), next);
  }

  close() {
    const { peerConnectionMap } = this;

    Object.keys(peerConnectionMap)
      .forEach((clientId) => {
        peerConnectionMap[clientId].close();

        console.log('peerConnection', clientId, 'closed')
      });

    if (this.$timeout) {
      clearTimeout(this.$timeout);
    }
  }
}
