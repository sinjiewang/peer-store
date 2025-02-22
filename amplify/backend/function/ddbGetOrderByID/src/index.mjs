/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_ORDERTABLE_ARN
	API_PEERSTORE_ORDERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
import DdbOrder from './utils/DdbOrder.mjs'

export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`)

  const { id } = event.arguments

  if (!id) throw new Error('Bad Request')

  const ddbOrder = new DdbOrder()
  const res = await ddbOrder.queryByID({ id }).catch(err => {
    console.error('DdbOrder.query fail: ', err)
  })

  if (res.Items && res.Items.length) {return res.Items[0]
  }
}
