/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import AWS from 'aws-sdk'
import config from '/opt/nodejs/configure.json' assert { type: 'json' }

const env = process.env.ENV || 'dev';
const apiGateway = new AWS.ApiGatewayManagementApi({
  endpoint: config[env]['VISITOR_WEBSOCKET_API_URL'],
})

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const statusCode = 200
  const body = JSON.parse(event.body)
  const { clientId, data, action } = body

  if (!clientId) {
    return { statusCode }
  }

	await apiGateway.postToConnection({
		ConnectionId: clientId,
		Data: JSON.stringify({
			action,
			data,
		}),
	}).promise()

  return { statusCode }
}
