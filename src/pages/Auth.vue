<script setup>
  import '@aws-amplify/ui-vue/styles.css'
  import { onMounted, onUnmounted, ref } from 'vue'
  import { Hub } from 'aws-amplify/utils'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  onMounted(() => {
    const unsubscribe = Hub.listen('auth', (data) => {
      const { payload } = data
      const redirectPath = route.query.redirect || '/browse'

      if (payload.event === 'signedIn') {
        router.push(redirectPath)
      }
    })

    onUnmounted(() => unsubscribe())
  })
</script>

<template>
  <authenticator>
    <!-- <template v-slot='{ user, signOut }'>
      <h1>Hello {{ user.username }}!</h1>
      <button @click="signOut">Sign Out</button>
    </template> -->
  </authenticator>
</template>

<style scoped>

</style>
