const AWS = require('aws-sdk')
const ecpay_payment = require('ecpay_aio_nodejs')
const config = require('/opt/nodejs/configure.json')

const DdbBilling = require('../utils/DdbBilling')
const DdbOrder = require('../utils/DdbOrder')
const DdbStore = require('../utils/DdbStore')
const DdbPayment = require('../utils/DdbPayment')
const DdbStoreConnection = require('../utils/DdbStoreConnection')

const env = process.env.ENV || 'dev';
const OperationMode = env === 'dev' ? 'Test' : 'Production'
const apiGatewayVisitor = new AWS.ApiGatewayManagementApi({
  endpoint: config[env]['VISITOR_WEBSOCKET_API_URL'],
})
const apiGatewayStore = new AWS.ApiGatewayManagementApi({
  endpoint: config[env]['STORE_WEBSOCKET_API_URL'],
})

const ECPAY_PAYMENT_OPTIONS = {
  OperationMode, //Test or Production
  MercProfile: {
    MerchantID: '',
    HashKey: '',
    HashIV: '',
  },
  IgnorePayment: [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
  ],
  IsProjectContractor: false,
}

const getData = async (id, Clz) => {
  let item = null

  try {
    const instance = new Clz()
    const res = await instance.queryByID({ id })

    if (res.Items && res.Items.length > 0) item = res.Items.pop()
  } catch (err) {
    console.warn(`queryByID(${id}) failed`, err)
  }

  return item
}

const getbBillingByTradeNo = async (tradeNo) => {
 let item = null

  try {
    const instance = new DdbBilling()
    const res = await instance.queryByTradeNo({ tradeNo })

    if (res.Items && res.Items.length > 0) item = res.Items.pop()
  } catch (err) {
    console.warn(`queryByTradeNo(${tradeNo}) failed`, err)
  }

  return item
}

const getConnectionByStoreId = async (storeId) => {
  let item = null

   try {
     const instance = new DdbStoreConnection()
     const res = await instance.queryByStoreID({ storeID: storeId })

     if (res.Items && res.Items.length > 0) item = res.Items.pop()
   } catch (err) {
     console.warn(`queryByTradeNo(${storeId}) failed`, err)
   }

   return item
 }

const checkMacValue = ({
  MerchantID,
  HashKey,
  HashIV,
  CheckMacValue,
  data,
}={}) => {
  const options = {
    ...ECPAY_PAYMENT_OPTIONS,
    MercProfile: {
      MerchantID,
      HashKey,
      HashIV,
    },
  }
  const create = new ecpay_payment(options)
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data)

  return CheckMacValue === checkValue
}

const createPayment = async (data) => new DdbPayment().create(data)

const updateOrder = async ({id , data}) => new DdbOrder().update({id , data})

module.exports.postECPayPaments = async function (req, res) {
  const { MerchantID, MerchantTradeNo, CheckMacValue } = req.body

  const billing = await getbBillingByTradeNo(MerchantTradeNo)

  if (!billing) return console.warn('Billing not found', MerchantTradeNo) && res.status(200).end()

  const { orderID: orderId, connectionId } = billing
  const order = await getData(orderId, DdbOrder) // await getOrder(orderId)

  if (!order) return console.warn('Order not found', orderId) && res.status(200).end()

  const { storeID: storeId } = order
  const store = await getData(storeId, DdbStore) // await getStore(storeId)

  if (!store) return console.warn('Store not found', storeId) && res.status(200).end()

  const { hashKey: HashKey, hashIV: HashIV } = store
  const data = { ...req.body }

  delete data.CheckMacValue

  const isValid = checkMacValue({
    MerchantID,
    HashKey,
    HashIV,
    CheckMacValue,
    data,
  })

  console.log('確認交易正確性：', isValid)

  if (isValid) {
    const status = 'PAID'
    const payment = await createPayment(req.body)

    await updateOrder({ id: orderId, data: {
      status,
      paymentID: payment.id,
    }})
    //visitor
    try {
      await apiGatewayVisitor.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          action: 'payment',
          data: status,
        }),
      }).promise()
    } catch (err) {
      console.warn('apiGatewayVisitor.postToConnection failed', err)
    }
    // store
    try {
      const storeConnection = await getConnectionByStoreId(storeId)

      await apiGatewayStore.postToConnection({
        ConnectionId: storeConnection.connectionID,
        Data: JSON.stringify({
          action: 'payment',
          data: {
            orderId,
            orderDetail: order.detail,
            orderStatus: status,
            billingId: billing.id,
            tradeNo: MerchantTradeNo,
          },
        }),
      }).promise()
    } catch (err) {
      console.warn('apiGatewayStore.postToConnection failed', err)
    }
  }

  res.send('1|OK')
}

module.exports.getECPayPaments = async function(req, res) {
  const billing = await getbBillingByTradeNo(req.query.tradeNo)

  if (billing) {
    try {
      await apiGatewayVisitor.postToConnection({
        ConnectionId: billing.connectionId,
        Data: JSON.stringify({
          action: 'payment',
          data: 'PENDING',
        }),
      }).promise()
    } catch (err) {
      console.warn('apiGatewayVisitor.postToConnection failed', err)
    }
  }

  const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>自動關閉分頁</title>
</head>
<body><script>window.onload=()=>{window.close();setTimeout(()=>history.back(),500)}</script>
</body>
</html>
`
  res.status(200).send(html)
}
