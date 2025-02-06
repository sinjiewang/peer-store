<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { useTheme } from 'vuetify'
  import LocalesBtn from './header/LocalesBtn.vue'
  import ThemeBtn from './header/ThemeBtn.vue'

  defineProps({
    drawer: {
      type: Boolean,
      required: true,
    },
  })
  defineEmits(['update:drawer'])

  const router = useRouter()
  const store = useStore()
  const theme = useTheme()
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const user = computed(() => store.getters['auth/user'])

  function onLoginClick() {
    router.push('/login')
  }

  async function onLogoutClick() {
    await store.dispatch('auth/signOut')

    router.push('/login')
  }
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon
      class="hidden-lg-and-up"
      @click="$emit('update:drawer', !drawer)"
    ></v-app-bar-nav-icon>
    <v-app-bar-title class="text-left" />

    <v-spacer />

    <LocalesBtn />
    <ThemeBtn />
    <v-btn
      v-if="!isAuthenticated"
      class="app-bar-button"
      variant="outlined"
      @click="onLoginClick"
    >
      {{ $t('Login') }}
    </v-btn>
    <v-btn
      v-if="isAuthenticated"
      class="app-bar-button"
      variant="outlined"
      @click="onLogoutClick"
      :title="user?.email"
    >
      {{ $t('Logout') }}
    </v-btn>
  </v-app-bar>
</template>

<style scoped lang="scss">
.app-bar-button {
  margin-right: 20px !important;
}
</style>