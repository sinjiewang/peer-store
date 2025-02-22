import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_STORECONNECTIONTABLE_NAME, REGION } = process.env;

class DdbSiteConnection extends DdbActions {
  static TABLE = API_PEERSTORE_STORECONNECTIONTABLE_NAME;

  create({
    connectionID,
    positionID,
    storeID,
  }) {
    return DdbSiteConnection.create({
      region: REGION,
      data: { connectionID, positionID, storeID },
    })
  }

  queryByStoreID({ storeID }) {
    return DdbSiteConnection.query({
      region: REGION,
      condition: { storeID },
    }, {
      IndexName: 'storeConnectionsByStoreID',
    })
  }
};

export default DdbSiteConnection;