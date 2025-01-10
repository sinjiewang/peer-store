import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_STORECONNECTIONTABLE_NAME, REGION } = process.env;

class DdbStoreConnection extends DdbActions {
  static TABLE = API_PEERSTORE_STORECONNECTIONTABLE_NAME;

  queryByConnectionID({ connectionID }) {
    return DdbStoreConnection.query({
      region: REGION,
      condition: { connectionID },
    }, {
      IndexName: 'storeConnectionsByConnectionID',
    });
  }

  queryByPositionID({ positionID }) {
    return DdbStoreConnection.query({
      region: REGION,
      condition: { positionID },
    }, {
      IndexName: 'storeConnectionsByPositionID',
    });
  }

  delete({ id }) {
    return DdbStoreConnection.delete({
      region: REGION,
      condition: { id },
    })
  }
};

export default DdbStoreConnection;