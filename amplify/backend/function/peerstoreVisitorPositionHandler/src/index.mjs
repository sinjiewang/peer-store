/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_VISITORCONNECTIONTABLE_ARN
	API_PEERSTORE_VISITORCONNECTIONTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import DdbVisitorConnection from './utils/DdbVisitorConnection.mjs';
import { getZone } from './utils/positionHelper.mjs';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  const { connectionId: connectionID } = event.requestContext;
  const body = JSON.parse(event.body);
  const { lat, lng } = body.data;
  const ddbVisitorConnection = new DdbVisitorConnection();
  const res = await ddbVisitorConnection.query({ connectionID }).catch(err => {
    console.error('ddbVisitorConnection.query fail: ', err);
  });

  if (res.Items && res.Items.length) {
    await Promise.all(res.Items.map(({ id }) => {
      console.log('ddbVisitorConnection.update id:', id, { lat, lng });

      return ddbVisitorConnection.update({
        id,
        data: {
          lat: Number(lat),
          lng: Number(lng),
          zone: getZone({ lat, lng }),
        },
      });
    }));
  }

  return {
    statusCode: 200,
  };
};
