/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_POSITIONTABLE_ARN
	API_PEERSTORE_POSITIONTABLE_NAME
	API_PEERSTORE_STORECONNECTIONTABLE_ARN
	API_PEERSTORE_STORECONNECTIONTABLE_NAME
  API_PEERSTORE_STORETABLE_ARN
  API_PEERSTORE_STORETABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import DdbPosition from './utils/DdbPosition.mjs'
import DdbStore from './utils/DdbStore.mjs'
import DdbStoreConnection from './utils/DdbStoreConnection.mjs'

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { connectionId: connectionID } = event.requestContext
  const ddbStoreConnection = new DdbStoreConnection()
  const ddbPosition = new DdbPosition()
  const ddbStore = new DdbStore()
  const res = await ddbStoreConnection.queryByConnectionID({ connectionID }).catch(err => {
    console.error('ddbStoreConnection.queryByConnectionID fail: ', err)
  })

  if (res.Items && res.Items.length) {
    const positionIDs = new Set()

    // remove StoreConnection
    await Promise.all(res.Items.map(({ id, storeID, positionID }) => {
      console.log('ddbStoreConnection.delete id:', id)

      positionIDs.add(positionID)

      return ddbStoreConnection.delete({ id })
        .then(() => ddbStore.update({
          id: storeID,
          data: {
            state: null,
          },
        }))
    }))

    // remove the Position if there is no relation
    await Promise.all(Array.from(positionIDs).map((positionID) => {
      return new Promise(async (resolve, reject) => {
        const result = await ddbStoreConnection.queryByPositionID({ positionID }).catch(err => {
          console.error('ddbStoreConnection.queryByPositionID fail: ', err)

          return reject(err)
        })

        if (result && result.Count) {
          return resolve()
        }

        await ddbPosition.delete({ positionID }).catch(err => {
          console.error('ddbPosition.delete fail: ', err)

          return reject(err)
        })

        resolve()
      });
    }));
  }

  return {
    statusCode: 200,
  }
}
