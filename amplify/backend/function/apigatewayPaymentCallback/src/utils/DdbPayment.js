const DdbActions = require('./DdbActions')
// import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_PAYMNETTABLE_NAME, REGION } = process.env;

module.exports = class DdbPayment extends DdbActions {
  static TABLE = API_PEERSTORE_PAYMNETTABLE_NAME;

  create(data) {
    return DdbPayment.create({
      region: REGION,
      data,
    })
  }
};
