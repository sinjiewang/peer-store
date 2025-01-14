import DdbActions from '/opt/nodejs/DdbActions.mjs'

const { API_PEERSTORE_VISITORCONNECTIONTABLE_NAME, REGION } = process.env

class DdbVisitorConnection extends DdbActions {
  static TABLE = API_PEERSTORE_VISITORCONNECTIONTABLE_NAME

  create(data) {
    return DdbVisitorConnection.create({
      region: REGION,
      data,
    })
  }
}

export default DdbVisitorConnection