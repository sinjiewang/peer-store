// import { sha256 } from 'js-sha256';
import Signaling from './index';

export default class ClientSignaling extends Signaling {
  constructor({ tunnel, password }={}) {
    super({ tunnel });

    // this.password = password ? sha256(password) : null;
  }

  sendOffer({ storeId, desc }) {
    const { tunnel, password } = this;
    const data = {
      action: 'offer',
      storeId,
      data: desc,
    };

    // if (password) {
    //   data.password = password;
    // }

    if (tunnel && tunnel.send) {
      tunnel.send(data);
    }
  }

  sendIceCandidate({ storeId, candidate }) {
    const { tunnel, password } = this;
    const data = {
      action: 'icecand',
      storeId,
      data: candidate,
    };

    // if (password) {
    //   data.password = password;
    // }

    if (tunnel && tunnel.send) {
      tunnel.send(data);
    }
  }
}
