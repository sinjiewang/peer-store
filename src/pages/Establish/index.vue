<script setup>
  import { inject, provide, ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useStore } from 'vuex'
  import { getStore } from '@/graphql/queries'
  import { createOrder } from '@/graphql/mutations'

  import Service from '@/utils/Service/StoreService.js'
  import IDBRepository from '@/utils/IndexedDB/IDBRepository.js'

  import Header from './Header.vue'

  const { t: $t } = useI18n()
  const route = useRoute()
  const vStore = useStore()
  const client = inject('graphqlClient')

  const INCORRECT_ID_ALERT = $t('Incorrect ID. Please try again.')
  const DO_NOT_CLOSE_TAB_PAGE = $t('Please do not close this tab or webpage.')

  const alertMessage = ref(INCORRECT_ID_ALERT)
  const showAlert = ref(false)
  const showProgress = ref(false)
  const store = ref(null)
  const service = ref(null)
  const position = ref(null)

  provide('storeInfo', store)
  provide('storePosition', position)
  provide('storeService', service)

  const getStoreInfo = async (id) => {
    showProgress.value = true

    try {
      const result = await client.graphql({
        query: getStore,
        variables: { id },
      })

      return result.data.getStore
    } catch (err) {
      console.error('Error getStored:', err)

      showAlert.value = true
    } finally {
      showProgress.value = false
    }
  }
  const getAddressPosition = async ({ address, zip }={}) => address
    ? await vStore.dispatch('geolocation/getAddressFromPosition', { address, zip })
    : await vStore.dispatch('geolocation/getCurrentPosition')
  const createRepository = async (storeId) => {
    const repository = new IDBRepository({ storeId })

    await repository.connect()

    return repository
  }
  const createService = ({ repository, watermark, storeInfo }) => new Service({
    repository,
    watermark,
    storeInfo,
    createOrderFromCloud,
  })

  const onConnect = async (server) => {
    service.value?.setServer(server)
    store.value.state = 'online'
    alertMessage.value = DO_NOT_CLOSE_TAB_PAGE
    showAlert.value = true
  }
  const onDisconnect = () => {
    service.value?.removeServer()
    store.value.state = null
    showAlert.value = false
  }
  const createOrderFromCloud = async ({ storeId, totalAmount, detail, expired, status }) => {
    const input = { totalAmount, detail, expired, status, storeID: storeId }

    try {
      return client.graphql({
        query: createOrder,
        variables: { input },
      })
    } catch (err) {
      console.error('createOrder failed', err)

      throw err
    }
  }

  onMounted(async () => {
    const { id: storeId } = route.params

    if (storeId) {
      const storeInfo = await getStoreInfo(storeId)

      position.value = await getAddressPosition(storeInfo)

      const { id, name, email, phone, address } = storeInfo
      const watermark = `@${ storeInfo.name }`
      const repository = await createRepository(storeId)
      // proxy/service instance
      service.value = createService({
        repository,
        watermark,
        storeInfo: {
          id, name, email, phone, address,
          position: {
            ...position.value
          },
        },
      })
      store.value = storeInfo
    } else {
      showAlert.value = true
    }
  })
</script>

<template>
  <v-container fluid class="h-100 pa-0">
    <v-alert
      v-model="showAlert"
      :text="alertMessage"
      color="error"
      icon="mdi-message-alert"
      closable
    ></v-alert>
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

    <Header v-if="store" :store="store"></Header>

    <router-view
      v-if="store"
      @connect="onConnect"
      @disconnect="onDisconnect"
    ></router-view>
  </v-container>
</template>

<style scoped lang="scss">

</style>
