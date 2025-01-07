<script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { useTheme } from 'vuetify'

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

  const dataTheme = document.documentElement.getAttribute('data-theme')
  const currentTheme = ref(dataTheme)
  const loginLable = ref('Login')
  const logoutLable = ref('Logout')

  function onLoginClick() {
    router.push('/login')
  }
  async function onLogoutClick() {
    await store.dispatch('auth/signOut')

    router.push('/login')
  }
  function onThemeClick() {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', currentTheme.value)
    theme.global.name.value = currentTheme.value
    localStorage.setItem('theme', currentTheme.value)
  }
</script>

<template>
  <v-app-bar>
    <v-app-bar-nav-icon
      class="hidden-lg-and-up"
      @click="$emit('update:drawer', !drawer)"
    ></v-app-bar-nav-icon>

    <v-app-bar-title class="text-left"></v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn
      :icon="currentTheme === 'dark' ? 'mdi-brightness-2' : 'mdi-brightness-7'"
      class="mr-3"
      @click="onThemeClick"
    ></v-btn>
    <v-btn
      v-if="!isAuthenticated"
      class="app-bar-button"
      variant="outlined"
      @click="onLoginClick"
    >
      {{ loginLable }}
    </v-btn>
    <v-btn
      v-if="isAuthenticated"
      class="app-bar-button"
      variant="outlined"
      @click="onLogoutClick"
    >
      {{ logoutLable }}
    </v-btn>
  </v-app-bar>
</template>

<style scoped type="text/scss">
.app-bar-button {
  margin-right: 20px !important;
}
</style>