/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_STORECONNECTIONTABLE_ARN
	API_PEERSTORE_STORECONNECTIONTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import AWS from 'aws-sdk';
import config from '/opt/nodejs/configure.json' assert { type: 'json' }

const env = process.env.ENV || 'dev';
const storeApiGateway = new AWS.ApiGatewayManagementApi({
  endpoint: config[env]['STORE_WEBSOCKET_API_URL'],
})

import DdbStoreConnection from './utils/DdbStoreConnection.mjs';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const statusCode = 200;
  const body = JSON.parse(event.body);
  const { storeId: storeID, data, action } = body;
  const clientId = event.requestContext.connectionId;

  if (!storeID) {
    return { statusCode }
  }

  const ddbStoreConnection = new DdbStoreConnection();
  const res = await ddbStoreConnection.queryByStoreID({ storeID }).catch(err => {
    console.error('DdbStoreConnection.query fail: ', err)
  })

  if (res.Items && res.Items.length) {
    const store = res.Items.shift()

    await storeApiGateway.postToConnection({
      ConnectionId: store.connectionID,
      Data: JSON.stringify({
        action,
        clientId,
        data,
      }),
    }).promise()
  }

  return { statusCode }
}
