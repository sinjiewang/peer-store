<script setup>
  import { ref, onMounted, provide } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'

  import Header from './Header.vue'
  import Service from '@/utils/Service/VisitorService.js'
  import IDBRepository from '@/utils/IndexedDB/IDBRepository.js'

  const route = useRoute()
  const vStore = useStore()

  const showProgress = ref(false)
  const dialog = ref(false)
  const service = ref(null)
  const storeInfo = ref({})
  const cart = ref([])

  provide('storeInfo', storeInfo)
  provide('cart', cart)

  const connectTunnel = (storeId) => vStore.dispatch('cloud/visitorConnect', { storeId })
  const disconnectTunnel = () => vStore.dispatch('cloud/disconnect')
  const createRepository = async () => {
    const repository = new IDBRepository()

    await repository.connect()

    return repository
  }
  const connect = async () => {
    showProgress.value = true

    try {
      const { id: storeId } = route.params
      const tunnel = await connectTunnel(storeId)
      const repository = await createRepository()
      const proxy = new Service({ storeId, repository })

      await proxy.connect({ storeId, tunnel })

      disconnectTunnel()

      service.value = proxy
      storeInfo.value = await proxy.getStoreInfo()

      const { items } = await proxy.getCartItemsByStoreId(storeId)

      console.log(items)

      cart.value = items
    } catch (err) {
      console.error('CloudConnection connect fail:', err)

      dialog.value = true
    } finally {
      showProgress.value = false
    }
  }
  const onReconnectClick = () => {
    dialog.value = false

    connect()
  }

  onMounted(async () => {
    // const { id: storeId } = route.params
    // dialog.value = true
    connect()
  })
</script>

<template>
  <v-container class="h-100 pa-0">
    <div
      v-if="showProgress"
      class="d-flex justify-center align-center h-100"
    >
      <v-progress-circular
        :size="100"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>

    <template v-if="service">
      <Header
        :storeInfo="storeInfo"
      ></Header>
      <!-- <List
        :service="service"
      /> -->
      <router-view
        :service="service"
      ></router-view>
    </template>

    <v-dialog
      v-model="dialog"
      width="auto"
      persistent
    >
      <v-card
        width="300"
        :text="$t('Connection Failed')"
      >
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="onReconnectClick"
            variant="elevated"
            color="primary"
          >
            {{ $t('Reconnect') }}
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped lang="scss">

</style>
