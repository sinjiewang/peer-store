const DdbActions = require('./DdbActions')
// import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_STORETABLE_NAME, REGION } = process.env;

module.exports = class DdbStore extends DdbActions {
  static TABLE = API_PEERSTORE_STORETABLE_NAME;

  queryByID({ id }) {
    return DdbStore.query({
      region: REGION,
      condition: { id },
    })
  }
};
