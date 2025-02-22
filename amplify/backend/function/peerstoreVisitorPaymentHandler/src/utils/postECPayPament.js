const ecpayPayment = require('ecpay_aio_nodejs')
const config = require('/opt/nodejs/configure.json')
const generateRandomString = require('./generateRandomString')

const DdbBilling = require('./DdbBilling')
const DdbOrder = require('./DdbOrder')
const DdbStore = require('./DdbStore')

const env = process.env.ENV || 'dev';
const OperationMode = env === 'dev' ? 'Test' : 'Production'

const RETURN_URL = config[env]['PAYMENT_RETURN_URL']
const ECPAY_RETURN_URL = `${RETURN_URL}/ecpay`
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

const createBilling = async ({ orderId, tradeNo, connectionId }) => new DdbBilling().create({ orderID: orderId, tradeNo, connectionId })
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
const createForm = ({
  MerchantTradeNo,
  MerchantID,
  HashKey,
  HashIV,
  TotalAmount,
  ItemName,
  ReturnURL,
  ClientBackURL,
}) => {
  const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
  const baseParam = {
    MerchantTradeNo,
    MerchantTradeDate,
    TotalAmount,
    TradeDesc: '測試交易描述',
    ItemName,
    ReturnURL,
    ClientBackURL,
  }

  const options = {
    ...ECPAY_PAYMENT_OPTIONS,
    MercProfile: {
      MerchantID,
      HashKey,
      HashIV,
    },
  }
  let invParams = {
    // RelateNumber: 'PLEASE MODIFY',  //請帶30碼uid ex: SJDFJGH24FJIL97G73653XM0VOMS4K
    // CustomerID: 'MEM_0000001',  //會員編號
    // CustomerIdentifier: '',   //統一編號
    // CustomerName: '測試買家',
    // CustomerAddr: '測試用地址',
    // CustomerPhone: '0123456789',
    // CustomerEmail: 'johndoe@test.com',
    // ClearanceMark: '2',
    // TaxType: '1',
    // CarruerType: '',
    // CarruerNum: '',
    // Donation: '2',
    // LoveCode: '',
    // Print: '1',
    // InvoiceItemName: '測試商品1|測試商品2',
    // InvoiceItemCount: '2|3',
    // InvoiceItemWord: '個|包',
    // InvoiceItemPrice: '35|10',
    // InvoiceItemTaxType: '1|1',
    // InvoiceRemark: '測試商品1的說明|測試商品2的說明',
    // DelayDay: '0',
    // InvType: '07'
  }
  const create = new ecpayPayment(options)

  return create.payment_client.aio_check_out_all(baseParam, invParams)
}

module.exports = async function({ orderId, connectionId }) {
  const order = await getData(orderId, DdbOrder) // await getOrder(orderId)

  if (!order) return console.warn('Order not found', orderId)

  const { storeID: storeId, detail, totalAmount } = order
  const store = await getData(storeId, DdbStore) // await getStore(storeId)

  if (!store) return console.warn('Store not found', storeId)

  const { merchantID: MerchantID, hashKey: HashKey, hashIV: HashIV } = store

  if (!MerchantID || !HashKey || !HashIV) return console.warn('Store data incorrect', MerchantID, HashKey, HashIV)

  const itemName = JSON.parse(detail).map((item) => `${item.name}x${item.quantity}`).join('#')
  const tradeNo = generateRandomString()
  const htm = createForm({
    MerchantTradeNo: tradeNo,
    MerchantID,
    HashKey,
    HashIV,
    TotalAmount: String(totalAmount),
    ItemName: itemName,
    ReturnURL: ECPAY_RETURN_URL,
    ClientBackURL: `${ECPAY_RETURN_URL}?tradeNo=${tradeNo}`,
  })

  await createBilling({
    tradeNo,
    orderId,
    connectionId,
  })

  return htm
}
