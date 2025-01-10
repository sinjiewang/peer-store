import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_POSITIONTABLE_NAME, REGION } = process.env;

class DdbPosition extends DdbActions {
  static TABLE = API_PEERSTORE_POSITIONTABLE_NAME;

  create({ positionID, lat, lng }) {
    return DdbPosition.create({
      region: REGION,
      data: { positionID, lat, lng },
    }, {
      ConditionExpression: 'attribute_not_exists(id)',
    })
  }
};

export default DdbPosition;