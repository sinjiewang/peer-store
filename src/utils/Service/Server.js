import EventEmitter from 'events';

import Signaling from '@/utils/Signaling/ServerSignaling.js';
import RTCPeerServer from '@/utils/RTCPeer/RTCPeerServer.js';

export default class Server extends EventEmitter {
  constructor({ tunnel }={}) {
    super();

    const signaling = new Signaling({ tunnel });
    const host = new RTCPeerServer({ signaling });

    host.on('connect', (event) => this.onconnect(event));
    host.on('disconnect', (event) => this.ondisconnect(event));

    this.host = host;
    this.dataChannels = {};
  }

  async onconnect({ clientId }) {
    const dataChannel = await this.host.createDataChannel({
      clientId,
      label: 'data',
    });

    this.dataChannels[clientId] = dataChannel;
    this.emit('connect', {
      clientId,
      dataChannel,
    });
  }

  ondisconnect({ clientId }) {
    const dataChannel = this.dataChannels[clientId];

    if (dataChannel) {
      this.emit('disconnect', {
        clientId,
      });

      delete this.dataChannels[clientId];
    }
  }

  close() {
    this.host?.close();
  }
}
