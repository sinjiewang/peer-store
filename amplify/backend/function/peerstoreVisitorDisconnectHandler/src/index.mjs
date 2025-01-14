/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_VISITORCONNECTIONTABLE_ARN
	API_PEERSTORE_VISITORCONNECTIONTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import DdbVisitorConnection from './utils/DdbVisitorConnection.mjs'

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const { connectionId: connectionID } = event.requestContext
  const ddbVisitorConnection = new DdbVisitorConnection()
  const res = await ddbVisitorConnection.queryByConnectionID({ connectionID }).catch(err => {
    console.error('DdbVisitorConnection.queryByconnectionID fail: ', err)
  })

  if (res.Items && res.Items.length) {
    await Promise.all(res.Items.map(({ id }) => {
      console.log('DdbVisitorConnection.delete id:', id)

      return ddbVisitorConnection.delete({ id });
    }))
  }

  return {
    statusCode: 200,
  }
}
