<script setup>
  import { inject, ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'

  const route = useRoute()
  const vStore = useStore()
  const client = inject('graphqlClient')

  const showProgress = ref(false)
  const cloudConnection = ref(null)

  const connect = async () => {
    showProgress.value = true

    try {
      const connection = await vStore.dispatch('cloud/visitorConnect')

      cloudConnection.value = connection
    } catch (err) {
      console.error('CloudConnection connect fail:', err)
    } finally {
      showProgress.value = false
    }
  }
  const disconnect = () => {
    vStore.dispatch('cloud/disconnect')

    cloudConnection.value = null
  }

  onMounted(async () => {
    const { id: storeId } = route.params
  })
</script>

<template>
  <v-container class="h-100 pa-0">
    <v-btn
      :disabled="!!cloudConnection"
      @click="connect"
      color="success"
    >connect</v-btn>
    <v-btn
      :disabled="!cloudConnection"
      @click="disconnect"
      color="red"
    >disconnect</v-btn>
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
  </v-container>
</template>

<style scoped lang="scss">

</style>
