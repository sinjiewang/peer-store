import DdbActions from '/opt/nodejs/DdbActions.mjs'

const { API_PEERSTORE_VISITORCONNECTIONTABLE_NAME, REGION } = process.env

class DdbVisitorConnection extends DdbActions {
  static TABLE = API_PEERSTORE_VISITORCONNECTIONTABLE_NAME

  queryByConnectionID({ connectionID }) {
    return DdbVisitorConnection.query({
      region: REGION,
      condition: { connectionID },
    }, {
      IndexName: 'visitorConnectionsByConnectionID',
    })
  }

  delete({ id }) {
    return DdbVisitorConnection.delete({
      region: REGION,
      condition: { id },
    })
  }
}

export default DdbVisitorConnection