/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
  API_PEERSTORE_POSITIONTABLE_ARN
  API_PEERSTORE_POSITIONTABLE_NAME
  API_PEERSTORE_STORECONNECTIONTABLE_ARN
  API_PEERSTORE_STORECONNECTIONTABLE_NAME
  API_PEERSTORE_STORETABLE_ARN
  API_PEERSTORE_STORETABLE_NAME
  AUTH_PEERSTOREA570DC98_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import DdbPosition from './utils/DdbPosition.mjs'
import DdbStore from './utils/DdbStore.mjs'
import DdbStoreConnection from './utils/DdbStoreConnection.mjs'
import { getPositionId } from './utils/positionHelper.mjs'
import verifyIdToken from './utils/verifyIdToken.mjs'

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const { queryStringParameters, requestContext } = event
  const { connectionId: connectionID } = requestContext
  const { clientId, token, storeId: storeID, lat, lng } = queryStringParameters

  if (!queryStringParameters
      || !token
      || !clientId
      || !storeID
      || !lat
      || !lng
  ) {
    console.warn("queryStringParameters not valid")

    return {
      statusCode: 403,
      body: 'Connection refused: invalid params'
    }
    // if (!queryStringParameters.hasOwnProperty('token')  || !queryStringParameters.hasOwnProperty('clientId')) {
    //   return {
    //     statusCode: 403,
    //     body: 'Connection refused: invalid token'
    //   }
    // } else if (!queryStringParameters.hasOwnProperty('storeID')) {
    //   return {
    //     statusCode: 403,
    //     body: 'Connection refused: invalid storeID'
    //   }
    // } else if (!queryStringParameters.hasOwnProperty('lat') || !queryStringParameters.hasOwnProperty('lng')) {
    //   return {
    //     statusCode: 403,
    //     body: 'Connection refused: invalid position'
    //   }
    // }
  }

  let payload, res

  try {
    payload = await verifyIdToken({
      clientId,
      token,
    })
  } catch {
    console.warn("Token not valid")

    return {
      statusCode: 403,
      body: 'Connection refused: invalid params'
    }
  }

  const { sub } = payload
  const ddbStore = new DdbStore()
  const ddbPosition = new DdbPosition()
  const ddbStoreConnection = new DdbStoreConnection()
  const positionID = getPositionId({ lat, lng })

  // check storeID is authorized
  res = await ddbStore.queryByID({ id: storeID }).catch(err => {
    console.error('DdbStore.query fail: ', err)
  })

  const authorized = res?.Items?.length && res.Items[0].owner === `${sub}::${sub}`

  if (!authorized) {
    console.error('Unauthorized storeID', storeID, sub)

    return {
      statusCode: 401,
      body: 'Unauthorized'
    }
  }

  // check store is offline
  res = await ddbStoreConnection.queryByStoreID({ storeID }).catch(err => {
    console.error('DdbStoreConnection.query fail: ', err)
  })

  if (res.Items && res.Items.length) {
    console.error('Duplicate storeID', storeID)

    return {
      statusCode: 400,
      body: 'Duplicate storeID'
    }
  }

  try {
    await ddbPosition.create({
      positionID,
      lat: Number(lat),
      lng: Number(lng),
    })
  } catch (err) {
    console.warn('Duplicate positionId', positionID)
  }

  await ddbStoreConnection.create({
    positionID,
    connectionID,
    storeID,
  })

  await ddbStore.update({
    id: storeID,
    data: {
      state: 'online',
    }
  })

  return {
    statusCode: 200,
  }
}
