import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_POSITIONTABLE_NAME, REGION } = process.env;

class DdbPosition extends DdbActions {
  static TABLE = API_PEERSTORE_POSITIONTABLE_NAME;

  query({ positionID }) {
    return DdbPosition.query({
      region: REGION,
      condition: { positionID },
    });
  }

  delete({ positionID }) {
    return DdbPosition.delete({
      region: REGION,
      condition: { positionID },
    })
  }
};

export default DdbPosition;