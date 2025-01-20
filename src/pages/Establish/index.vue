<script setup>
  import { inject, ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useStore } from 'vuex'
  import { getStore } from '@/graphql/queries'
  import Service from '@/utils/Service/StoreService.js'

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
  const isConnecting = ref(false)

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
  const getAddressPosition = async ({ address, zip }={}) => {
    const center = address
      ? await vStore.dispatch('geolocation/getAddressFromPosition', { address, zip })
      : await vStore.dispatch('geolocation/getCurrentPosition')
    return center
  }
  const connectTunnel = async ({ storeId, lat, lng }) => vStore.dispatch('cloud/storeConnect', { storeId, lat, lng })
  const createService = ({ storeId, tunnel }) => new Service({ storeId, tunnel })

  const onConnectClick = async () => {
    const { id: storeId } = store.value
    const { lat, lng } = position.value

    isConnecting.value = true

    try {
      const tunnel = await connectTunnel({ storeId, lat, lng })
      const service = createService({ storeId, tunnel })

      service.value = service
      store.value.state = 'online'
      alertMessage.value = DO_NOT_CLOSE_TAB_PAGE
      showAlert.value = true
    } catch (err) {
      console.error('CloudConnection connect fail:', err)
    } finally {
      isConnecting.value = false
    }
  }
  const onDisconnectClick = () => {
    vStore.dispatch('cloud/disconnect')

    service.value?.close()
    service.value = null
    store.value.state = null
    showAlert.value = false
  }

  onMounted(async () => {
    const { id } = route.params

    if (id) {
      const storeInfo = await getStoreInfo(id)

      position.value = await getAddressPosition(storeInfo)
      store.value = storeInfo
    } else {
      showAlert.value = true
    }
  })
</script>

<template>
  <v-container class="h-100 pa-0">
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
      class="pt-4"
      v-if="store"
      :store="store"
      :position="position"
      :connecting="isConnecting"
      @connect="onConnectClick"
      @disconnect="onDisconnectClick"
    ></router-view>
  </v-container>
</template>

<style scoped lang="scss">

</style>
