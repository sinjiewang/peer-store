/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_VISITORCONNECTIONTABLE_ARN
	API_PEERSTORE_VISITORCONNECTIONTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import AWS from 'aws-sdk';
import config from '/opt/nodejs/configure.json' assert { type: 'json' };

import DdbVisitorConnection from './utils/DdbVisitorConnection.mjs'
import { parseEventItem } from './utils/dynamodbHelper.mjs'

const env = process.env.ENV || 'dev';
const apiGateway = new AWS.ApiGatewayManagementApi({
    endpoint: config[env]['VISITOR_WEBSOCKET_API_URL'],
});

const RANGE = 0.01;
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export async function handler(event) {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const ddbClientConnection = new DdbVisitorConnection();

  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);

    const { eventName, dynamodb } = record;
    let key, action;

    switch (eventName) {
      case 'INSERT':
        key = 'NewImage';
        action = 'add';
        break;
      case 'REMOVE':
        key = 'OldImage';
        action = 'remove';
        break;
      default:
        return Promise.resolve('Successfully processed DynamoDB record');
    }

    const item = parseEventItem(dynamodb[key]);
    const { lat, lng, positionID, createdAt, updatedAt, __typename } = item;
    const res = await ddbClientConnection.queryClientInZone({ lat, lng }, RANGE);

    if (res.Items && res.Items.length) {
      await Promise.all(res.Items.map(({ id, connectionID }) => {
        return apiGateway.postToConnection({
          ConnectionId: connectionID,
          Data: JSON.stringify({
            action,
            type: 'position',
            data: { lat, lng, positionID, createdAt, updatedAt, __typename },
          }),
        }).promise().catch((err) => {
          console.error('apiGateway.postToConnection() fail:', err);
          // connectionId Invalid
          return ddbClientConnection.delete({ id });
        });
      }));
    }
  }
  return Promise.resolve('Successfully processed DynamoDB record');
};
