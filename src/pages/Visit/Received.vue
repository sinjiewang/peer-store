<script setup>
  import { ref, inject, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
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
  const cart = inject('cart')

  const { service } = toRefs(props)

  const order = ref(null)
  const items = ref([])
  const billing = ref({})

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

      cart.value.forEach((item) => service.value.deleteCart(item.id))
      cart.value = []
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
        <v-card
          :title="$t('Order received')"
          class="text-left"
          variant="tonal"
        >
          <template v-slot:text>

          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
