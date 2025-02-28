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
    refreshCart: {
      type: Function,
      required: true,
    }
  })
  const route = useRoute()

  const client = inject('graphqlClient')

  const { service } = toRefs(props)

  const order = ref(null)
  const items = ref([])

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

      const promises = detail.map(({ id, quantity }) => new Promise(async (resolve) => {
        for (let i=0; i<quantity; i++) {
          await service.value.decreaseFromCart({ productId: id })
        }
        resolve()
      }))

      await Promise.all(promises)

      props.refreshCart()
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
      <v-col cols="12">
        <v-alert
          :value="true"
          :text="$t('Thank you. Your order has been received.')"
          icon="mdi-message-alert"
        ></v-alert>
      </v-col>
      <v-col class="d-none-md" cols="12" lg="3" :order-lg="1"></v-col>
      <v-col cols="12" lg="6" :order-lg="2">
        <v-card
          v-if="order"
          :title="$t('Payment')"
          class="text-left mb-4"
          variant="tonal"
        >
          <template v-slot:text>
            <v-row class="pt-4">
              <v-col cols="12">
                <v-text-field
                  v-model="order.id"
                  :label="$t('Order ID')"
                  type="string"
                  hide-details="auto"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  :label="$t('Email')"
                  type="string"
                  hide-details="auto"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="order.totalAmount"
                  :label="$t('Total')"
                  type="string"
                  hide-details="auto"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="order.status"
                  :label="$t('Status')"
                  type="string"
                  hide-details="auto"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="order.updatedAt"
                  :label="$t('Date')"
                  type="string"
                  hide-details="auto"
                  disabled
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
        </v-card>
        <v-card
          v-if="order"
          :title="$t('Order received')"
          class="text-left"
          variant="tonal"
        >
          <template v-slot:text>
            <v-row class="pt-4">
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
        </v-card>
      </v-col>
      <v-col class="d-none-md" cols="12" lg="3" :order-lg="3"></v-col>
    </v-row>
  </v-container>
</template>
