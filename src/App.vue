<script setup>
  import Header from './components/Header.vue'
  import Navigation from './components/Navigation.vue'
  import { onBeforeMount, onMounted, onUnmounted, ref, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'
  import { Hub } from 'aws-amplify/utils'

  const store = useStore()
  const route = useRoute()

  const queryMediaIsMediumScreen = () => window.matchMedia('(min-width: 1280px)').matches
  const defaultDrawer = queryMediaIsMediumScreen()
  const drawer = ref(defaultDrawer)
  const displayLayout = computed(() => route.meta.layout === undefined || route.meta.layout)

  function handleDrawer() {
    const isSmallScreen = !queryMediaIsMediumScreen()

    if (isSmallScreen && drawer.value) {
      drawer.value = false
    }
  }

  onMounted(async () => {
    const unsubscribe = Hub.listen('auth', (data) => {
      const { payload } = data

      if (payload.event === 'signedIn') {
        const { userId, signInDetails } = payload.data

        store.dispatch('auth/setUser', {
          userId,
          email: signInDetails.loginId,
        })
      }
    })

    onUnmounted(() => {
      unsubscribe()
    })
  })
</script>

<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <Header
        v-if="displayLayout"
        v-model:drawer="drawer"
      ></Header>

      <Navigation
        v-if="displayLayout"
        :drawer="drawer"
        @update:drawer="handleDrawer"
      ></Navigation>

      <v-main
        class="d-flex align-center justify-center main"
        @click="handleDrawer"
      >
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.app-bar-nav {
  @media screen and (min-width: 1280px) {
    display: none;
  }
}

.main {
  background-color: rgb(var(--v-theme-surface));
}
</style>
