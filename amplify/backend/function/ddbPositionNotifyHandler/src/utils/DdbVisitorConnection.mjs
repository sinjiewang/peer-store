import DdbActions from '/opt/nodejs/DdbActions.mjs'
import { toFixedTwo, getZone } from './positionHelper.mjs'

const { API_PEERSTORE_VISITORCONNECTIONTABLE_NAME, REGION } = process.env

class DdbVisitorConnection extends DdbActions {
  static TABLE = API_PEERSTORE_VISITORCONNECTIONTABLE_NAME

  queryClientInZone({ lat, lng }, range=0.01) {
    const latToFixedTwo = toFixedTwo(lat);
    const lngToFixedTwo = toFixedTwo(lng);
    const zoneList = [latToFixedTwo - range, latToFixedTwo, latToFixedTwo + range].map(($lat) =>
      [lngToFixedTwo - range, lngToFixedTwo, lngToFixedTwo + range].map(($lng) => getZone({
        lat: toFixedTwo($lat),
        lng: toFixedTwo($lng),
      }))
    ).flat();

    return Promise.all(zoneList.map((zone) => this.queryByZone(zone)))
      .then((res) => {
        const items = res.map(({ Items }) => Items).reduce((acc, curr) => acc.concat(curr));

        return {
          Items: items,
          Count: items.length,
          ScannedCount: items.length,
        };
      });
  }

  async queryByZone(zone) {
    let results = [];
    let lastEvaluatedKey = null;

    do {
      const response = await DdbVisitorConnection.query({
        region: REGION,
        condition: { zone },
      }, {
        IndexName: 'visitorConnectionsByZone',
        ExclusiveStartKey: lastEvaluatedKey,
      })

      results = results.concat(response.Items || []);
      lastEvaluatedKey = response.LastEvaluatedKey;
    }
    while (lastEvaluatedKey);

    return {
      Items: results,
      Count: results.length,
      ScannedCount: results.length,
    };
  }

  delete({ id }) {
    return DdbVisitorConnection.delete({
      region: REGION,
      condition: { id },
    })
  }
}

export default DdbVisitorConnection