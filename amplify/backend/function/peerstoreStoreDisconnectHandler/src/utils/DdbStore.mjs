import DdbActions from '/opt/nodejs/DdbActions.mjs';

const { API_PEERSTORE_STORETABLE_NAME, REGION } = process.env;

class DdbStore extends DdbActions {
  static TABLE = API_PEERSTORE_STORETABLE_NAME;

  update({ id, data }) {
    return DdbStore.update({
      region: REGION,
      condition: { id },
      data,
    })
  }
};

export default DdbStore;