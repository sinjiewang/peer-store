import short from 'short-uuid'
import Watermark from 'watermarkjs'
import IDBStoreOperator from './IDBStoreOperator'

const IMAGE_MAX_LENGTH = 1024
const THUMBNAIL_MAX_LENGTH = 400
const IMAGE_TYPE = 'image/webp'

function getFileSizeFromDataURL(dataURL) {
  const base64Str = dataURL.split(',')[1]
  const padding = (base64Str.endsWith('==') ? 2 : (base64Str.endsWith('=') ? 1 : 0))

  return base64Str.length * 3 / 4 - padding
}

export const Config = {
  options: { keyPath: 'id' },
  indexes: [
    {
      indexName: 'byUpdatedTime',
      keyPath: 'updatedTime',
      options: { unique: false },
    },
  ]
}

export default class File extends IDBStoreOperator {
  constructor({ db, storeName='file' }={}) {
    super({ db, storeName })
  }

  loadFileAsDataUrl(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (event) => resolve(event.target.result)
      reader.readAsDataURL(file)
    })
  }

  async loadImage(src) {
    const img = new Image()

    return  new Promise(resolve => {
      img.onload = () => resolve(img)
      img.src = src
    })
  }

  compressImage(img, maximum) {
    const { width, height } = img
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    let w, h


    if (width > maximum || height > maximum) {
      if (width >= height) {
        w = maximum
        h = maximum / width * height
      } else {
        h = maximum
        w = maximum / height * width
      }
    } else {
      w = width
      h = height
    }

    canvas.width = w
    canvas.height = h

    ctx.drawImage(img, 0, 0, width, height, 0, 0, w, h)

    const dataUrl = canvas.toDataURL(IMAGE_TYPE, 1)

    return {
      type: IMAGE_TYPE,
      src: dataUrl,
      size: getFileSizeFromDataURL(dataUrl),
      width: w,
      height: h,
    }
  }

  async genThumbnail(src) {
    return this.loadImage(src)
      .then((img) => this.compressImage(img, THUMBNAIL_MAX_LENGTH))
  }

  async appendWatermark(imageFile, watermark='@test') {
    const dataUrl = await this.loadFileAsDataUrl(imageFile)
    const img = await this.loadImage(dataUrl)
    const compressedImg = this.compressImage(img, IMAGE_MAX_LENGTH)

    return new Promise((resolve) => {
      Watermark([compressedImg.src])
        .image(Watermark.text.lowerLeft(watermark, `72px Josefin Slab`, '#000', 0.3))
        .then((img) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          resolve({
            ...compressedImg,
            src: canvas.toDataURL(IMAGE_TYPE),
          })
        })
    })
  }

  async createImage(file, { watermark }={}) {
    const watermarkedImg = await this.appendWatermark(file, watermark)
    const thumbnail = await this.genThumbnail(watermarkedImg.src)
    const stored = await super.create({
      id: short.generate(),
      name: 'thumbnail',
      ...thumbnail,
    })
    const name = file.name.replace(/\.[^/.]+$/, "")

    return super.create({
      id: short.generate(),
      name,
      thumbnailId: stored.id,
      ...watermarkedImg,
    })
  }

  async deleteImage(id) {
    const file = await super.queryById(id)

    if (file.thumbnailId) {
      try {
        await super.delete(file.thumbnailId)
      } catch (err) {
        console.warn('delete thumbnail failed', err)
      }
    }

    return super.delete(id)
  }

  create(data) {
    const id = short.generate()

    return super.create({
      id,
      ...data,
    })
  }

  getAll({ order='prev' }={}) {
    const { db, storeName } = this
    const items = []

    return new Promise((resolve, reject) => {
      const request = db.transaction(storeName)
          .objectStore(storeName)
          .index('byUpdatedTime')
          .openCursor(null, order)

      request.onsuccess = (event) => {
        var cursor = event.target.result
        if (cursor) {
          const item = cursor.value

          items.push(item)

          cursor.continue()
        } else {
          resolve({
            items,
            next: null,
          })
        }
      }
      request.onerror = (event) => reject(event.target.error)
    })
  }
}