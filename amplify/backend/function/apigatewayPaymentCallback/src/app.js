/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	API_PEERSTORE_BILLINGTABLE_ARN
	API_PEERSTORE_BILLINGTABLE_NAME
	API_PEERSTORE_GRAPHQLAPIIDOUTPUT
	API_PEERSTORE_ORDERTABLE_ARN
	API_PEERSTORE_ORDERTABLE_NAME
	API_PEERSTORE_PAYMNETTABLE_ARN
	API_PEERSTORE_PAYMNETTABLE_NAME
	API_PEERSTORE_STORECONNECTIONTABLE_ARN
	API_PEERSTORE_STORECONNECTIONTABLE_NAME
	API_PEERSTORE_STORETABLE_ARN
	API_PEERSTORE_STORETABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const createError = require('http-errors')
const {
	getECPayPaments,
	postECPayPaments,
} = require('./routes/ECPayPamentsHandler')
// declare a new express app
const app = express()
app.use(bodyParser.json())
// app.use(awsServerlessExpressMiddleware.eventContext())
app.use(express.urlencoded({ extended: true }))

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});
/**********************
 * Example get method *
 **********************/

// app.get('/payments', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// app.get('/payments/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

app.get('/payments/ecpay', getECPayPaments)

/****************************
* Example post method *
****************************/

// app.post('/payments', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

app.post('/payments/ecpay', postECPayPaments)

/****************************
* Example put method *
****************************/

// app.put('/payments', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// app.put('/payments/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

/****************************
* Example delete method *
****************************/

// app.delete('/payments', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// app.delete('/payments/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
})

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
