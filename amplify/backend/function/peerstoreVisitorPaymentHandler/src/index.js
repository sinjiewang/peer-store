/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_BILLINGTABLE_ARN
	API_PEERSTORE_BILLINGTABLE_NAME
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_ORDERTABLE_ARN
	API_PEERSTORE_ORDERTABLE_NAME
	API_PEERSTORE_STORETABLE_ARN
	API_PEERSTORE_STORETABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
const config = require('/opt/nodejs/configure.json')
const postECPayPament = require('./utils/postECPayPament')

const env = process.env.ENV || 'dev'
const apiGateway = new AWS.ApiGatewayManagementApi({
  endpoint: config[env]['VISITOR_WEBSOCKET_API_URL'],
})

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { connectionId } = event.requestContext
  const body = JSON.parse(event.body)
  const { data, vendor } = body

  let response = ''

  switch (vendor) {
    case 'ECPay':
      response = await postECPayPament({ orderId: data.orderId, connectionId })
      console.log('response', response)
      break
    default:
  }

  await apiGateway.postToConnection({
		ConnectionId: connectionId,
		Data: JSON.stringify({
			action: 'payment',
			data: response,
		}),
	}).promise()

  return { statusCode: 200 }
};
