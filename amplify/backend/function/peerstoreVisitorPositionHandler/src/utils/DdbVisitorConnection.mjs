import DdbActions from '/opt/nodejs/DdbActions.mjs'

const { API_PEERSTORE_VISITORCONNECTIONTABLE_NAME, REGION } = process.env

class DdbVisitorConnection extends DdbActions {
  static TABLE = API_PEERSTORE_VISITORCONNECTIONTABLE_NAME

  query({ connectionID }) {
    return DdbVisitorConnection.query({
      region: REGION,
      condition: { connectionID },
    }, {
      IndexName: 'visitorConnectionsByConnectionID',
    })
  }

  update({ id, data }) {
    return DdbVisitorConnection.update({
      region: REGION,
      condition: { id },
      data,
    });
  }
}

export default DdbVisitorConnection