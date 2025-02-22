const DdbActions = require('./DdbActions')
// import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_ORDERTABLE_NAME, REGION } = process.env;

module.exports = class DdbOrder extends DdbActions {
  static TABLE = API_PEERSTORE_ORDERTABLE_NAME;

  queryByID({ id }) {
    return DdbOrder.query({
      region: REGION,
      condition: { id },
    })
  }
};
