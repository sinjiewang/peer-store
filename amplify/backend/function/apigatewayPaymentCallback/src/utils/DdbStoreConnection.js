const DdbActions = require('./DdbActions')
// import DdbActions from '/opt/nodejs/DdbActions.mjs'

const { API_PEERSTORE_STORECONNECTIONTABLE_NAME, REGION } = process.env

module.exports = class DdbStoreConnection extends DdbActions {
  static TABLE = API_PEERSTORE_STORECONNECTIONTABLE_NAME

  queryByStoreID({ storeID }) {
    return DdbStoreConnection.query({
      region: REGION,
      condition: { storeID },
    }, {
      IndexName: 'storeConnectionsByStoreID',
    })
  }
}
