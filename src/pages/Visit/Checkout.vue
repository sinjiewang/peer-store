<script setup>
  import { ref, toRefs, inject, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { getOrderByID } from '@/graphql/queries'

  const props = defineProps({
    service: {
      type: Object,
      required: true,
    },
  })
  const route = useRoute()
  const router = useRouter()
  const store = useStore()

  const client = inject('graphqlClient')

  const { service } = toRefs(props)
  const order = ref(null)
  const items = ref([])
  const billing = ref({})
  const showLoading = ref(false)
  const disablePay = ref(false)

  const connectTunnel = (storeId) => store.dispatch('cloud/visitorConnect', { storeId })
  const disconnectTunnel = () => store.dispatch('cloud/disconnect')

  const postPaymentSuccess = () => router.push({ name: 'visitReceived', params: { orderId: route.params.orderId }})
  const postPayment = async (params={}) => {
    showLoading.value = true
    disablePay.value = true

    return new Promise(async (resolve, reject) => {
      try {
        const { storeId } = service.value
        const tunnel = await connectTunnel(storeId)
        const messsageHandler = (event) => {
          const { action, data } = JSON.parse(event.data)

          if (action === 'payment') {
            if (data === 'PAID' || data === 'PENDING') {
              tunnel.off('message', messsageHandler)
              disconnectTunnel()
              postPaymentSuccess()
            } if (data === 'FAILED') {
              disablePay.value = false
            } else {
              resolve(data)
            }
          }
        }

        tunnel.on('message', messsageHandler)
        tunnel.send({
          action: 'payment',
          data: params,
          vendor: 'ECPay'
        })
      } catch (err) {
        console.log('POST call failed: ', err)

        disablePay.value = false

        reject(err)
      }
    }).finally(() => {
      showLoading.value = false
    })
  }
  const onPayClick = async () => {
    const { orderId } = route.params
    const formHtmlString = await postPayment({ orderId })
    const div = document.createElement('div')

    div.innerHTML = formHtmlString.trim()

    const form = div.firstChild

    if (!form || form.tagName.toLowerCase() !== 'form') {
        return console.error("Invalid form HTML")
    }

    let paymentWindow = window.open("", "ECPayPayment", "width=1150,height=762")

    if (!paymentWindow) {
      return alert("請允許彈出視窗以完成付款！")
    }

    form.target = "ECPayPayment"
    document.body.appendChild(form)
    form.submit()
  }

  onMounted(async () => {
    const { orderId } = route.params

    try {
      const res = await client.graphql({
        query: getOrderByID,
        variables: { id: orderId },
      })

      const orderInfo = res.data.getOrderByID
      const detail = JSON.parse(orderInfo.detail)

      order.value = orderInfo
      items.value = detail
    } catch (err) {
      console.error('getOrderByID failed', err)
    }
  })
</script>

<template>
  <v-container
    class="h-100 overflow-y-auto"
    ref="containerRef"
  >
    <v-row>
      <v-col cols="12" sm="6">
        <v-card
          :title="$t('Billing details')"
          class="text-left"
          variant="tonal"
        >
        <template v-slot:text>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="billing.firstName"
                :label="`${$t('First name')} *`"
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="billing.lastName"
                :label="`${$t('Last name')} *`"
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="billing.companyName"
                :label="$t('Company name (optional)')"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="billing.region"
                :label="`${$t('Country / Region')} *`"
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="billing.address"
                :label="`${$t('Street address')} *`"
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="billing.city"
                :label="`${$t('Town / City')} *`"
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="billing.county"
                :label="`${$t('State / County')} *`"
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="billing.zip"
                :label="`${$t('Postcode / ZIP')} *`"
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="billing.phone"
                :label="`${$t('Phone')} *`"
                hide-details="auto"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card
          v-if="order"
          :title="$t('Your order')"
          class="text-left"
          variant="tonal"
        >
          <template v-slot:text>
            <v-row>
              <v-col cols="6">
                <span class="font-weight-bold">{{ $t('Product') }}</span>
              </v-col>
              <v-col cols="6" class="text-right">
                <span class="font-weight-bold">{{ $t('Subtotal') }}</span>
              </v-col>
              <v-divider></v-divider>
            </v-row>

            <template
              v-for="item, index in items"
              :key="index"
            >
              <v-row class="pt-2 pb-2">
                <v-col cols="9">
                  {{ item.name }}<span class="ml-2 font-weight-bold">x {{ item.quantity }}</span>
                </v-col>
                <v-col cols="3" class="text-right">
                  <span>NTD {{ item.quantity * item.price }}</span>
                </v-col>
              </v-row>
            </template>

            <v-row>
              <v-divider class="pb-2"></v-divider>
              <v-col cols="6">
                <span class="font-weight-bold">{{ $t('Total') }}</span>
              </v-col>
              <v-col cols="6" class="text-right">
                <span class="font-weight-bold">NTD {{ order.totalAmount }}</span>
              </v-col>
            </v-row>
          </template>
          <v-card-actions>
            <v-row>
              <v-col col="12">
                <v-btn
                  :disabled="disablePay"
                  :loading="showLoading"
                  @click="onPayClick"
                  variant="outlined"
                  color="green"
                  block
                >{{ $t('Pay') }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
        <div
          ref="form"
          class="d-none"></div>
      </v-col>
    </v-row>
  </v-container>
</template>
