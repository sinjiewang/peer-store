import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';

import { getTagged } from '@/utils/logger.js';

const Log = getTagged('connection:Protocol');
const MAX_CHUNK_LENGTH = 250000;

export default class Protocol extends EventEmitter {
  constructor({ clientId, dataChannel }={}) {
    super();

    this.clientId = clientId;
    this.dataChannel = dataChannel;
    this.$onmessage = (event) => this.onmessage(event);
    this.$onclose = (event) => this.onclose(event);
    this.$response = {};

    dataChannel.on('message', this.$onmessage);
    dataChannel.on('close', this.$onclose);

  }

  onclose() {
    const { dataChannel, $onmessage, $onclose } = this;

    dataChannel.off('message', $onmessage);
    dataChannel.off('close', $onclose);

    delete this.$onmessage;
    delete this.$onclose;

    this.emit('close');
    this.dataChannel = null;
  }

  onmessage(event) {
    const data = JSON.parse(event.data)
    const { type } = data

    switch(type) {
      case 'response':
        return this.onresponse(data)
      default:
    }

    if (this.clientId) {
      data.clientId = this.clientId
    }

    this.emit(type, data)
  }

  onresponse(response) {
    const res = this.$response[response.messageId];

    if (!res) return;

    console.warn(response)

    if (response.error) {
      return res.reject(new Error(response.error));
    }

    if (response.body && response.contentLength) {
      const { body, contentLength } = response;

      if (res.body) {
        res.body += body;
      } else {
        res.body = body;
      }

      console.log('received', res.body.length, Math.round(res.body.length / contentLength * 100) + '%')

      if (res.body.length >= contentLength) {
        res.resolve(res.body);
      }
    } else if (!response.contentLength) {
      res.resolve();
    }
  }

  async sendRequest(content={}, timeout=30) {
    const messageId = uuidv4()
    let $timeout

    return new Promise(( resolve, reject ) => {

      if (timeout >= 0) {
        $timeout = setTimeout(() => reject(new Error('Request Timeout')), timeout * 1000)
      }

      this.$response[messageId] = {
        resolve,
        reject,
        content,
      }
      this.send({
        type: 'request',
        messageId,
        ...content,
      })
    }).finally(() => {
      clearTimeout($timeout)

      delete this.$response[messageId]
    })
  }

  sendResponse(messageId, data) {
    const content = typeof data === 'string' ? data : JSON.stringify(data)
    const length = content.length

    for (let start=0; start<=length; start+=MAX_CHUNK_LENGTH) {
      const end = (start + MAX_CHUNK_LENGTH) <= length ? (start + MAX_CHUNK_LENGTH) : length
      const chunk = content.substring(start, end)

      this.send({
        type: 'response',
        messageId,
        contentLength: length,
        body: chunk,
      })
    }
  }

  sendReject(messageId, code=403, message='Forbidden') {
    this.send({
      type: 'response',
      messageId,
      error: {
        code,
        message,
      },
    })
  }

  sendMessage(content) {
    this.send({
      type: 'message',
      data: content,
    })
  }

  send(data) {
    try {
      this.dataChannel.send(JSON.stringify(data))
    } catch (err) {
      Log.warn(`${err.toString()}, unsent data: ${data}`)
    }
  }
}
