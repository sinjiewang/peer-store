import short from 'short-uuid'
import IDBStoreOperator from "./IDBStoreOperator"
// import genThumbnail from '../genThumbnail.js'

export default class StoreFile extends IDBStoreOperator {
  constructor({ db, storeName='file' }={}) {
    super({ db, storeName })
  }

  create(data) {
    const id = short.generate();
    const item = {
      id,
      ...data,
    }

    return super.create(item)
  }

  // async createImage(data) {
  //   const { src, thumbnailSrc, image } = await genThumbnail(data.src)
  //   const { width, height } = image;
  //   const item = {
  //     ...data,
  //     src,
  //     thumbnailSrc,
  //     info: {
  //       width,
  //       height,
  //     },
  //   };

  //   return this.create(item)
  // }
}