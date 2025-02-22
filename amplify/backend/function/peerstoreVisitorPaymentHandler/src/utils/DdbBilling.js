const DdbActions = require('./DdbActions')
// import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_BILLINGTABLE_NAME, REGION } = process.env;

module.exports = class DdbBilling extends DdbActions {
  static TABLE = API_PEERSTORE_BILLINGTABLE_NAME;

  create({ tradeNo, orderID, connectionId }={}) {
    return DdbBilling.create({
      region: REGION,
      data: { tradeNo, orderID, connectionId },
    })
  }
};
