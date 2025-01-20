<script setup>
  import { inject, ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'

  import Service from '@/utils/Service/VisitorService.js'

  const route = useRoute()
  const vStore = useStore()
  // const client = inject('graphqlClient')

  const showProgress = ref(false)
  const dialog = ref(false)

  const connectTunnel = (storeId) => vStore.dispatch('cloud/visitorConnect', { storeId })
  const disconnectTunnel = () => vStore.dispatch('cloud/disconnect')
  const connect = async () => {
    showProgress.value = true

    try {
      const { id: storeId } = route.params
      const tunnel = await connectTunnel(storeId)
      const service = new Service()

      await service.connect({ storeId, tunnel })

      disconnectTunnel()

      service.sendMessage('hello!!')
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
    dialog.value = true
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
