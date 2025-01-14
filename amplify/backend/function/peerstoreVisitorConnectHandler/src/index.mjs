/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_VISITORCONNECTIONTABLE_ARN
	API_PEERSTORE_VISITORCONNECTIONTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import DdbStore from './utils/DdbStore.mjs'
import DdbVisitorConnection from './utils/DdbVisitorConnection.mjs'
import { getZone } from './utils/positionHelper.mjs'

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const { connectionId: connectionID } = event.requestContext
  const { lat=0, lng=0, storeId: id='' } = event.queryStringParameters || {}
  const ddbVisitorConnection = new DdbVisitorConnection()
  const ddbStore = new DdbStore()

  const res = await ddbStore.queryByID({ id }).catch(err => {
    console.error('DdbStore.query fail: ', err)
  })

  if (!res?.Items?.length) {
    console.warn("storeId not valid")

    return {
      statusCode: 404,
      body: 'Not Found'
    }
  } else if (!res.Items[0].state) {

    console.warn("store is offline")

    return {
      statusCode: 403,
      body: 'Connection refused'
    }
  }

  await ddbVisitorConnection.create({
    connectionID,
    lat: Number(lat),
    lng: Number(lng),
    zone: getZone({ lat, lng }),
  })

  return {
    statusCode: 200,
  }
}
