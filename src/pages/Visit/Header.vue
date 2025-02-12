<script setup>
  import { inject, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  defineProps({
    storeInfo: {
      type: Object,
      required: true,
    },
  })

  const router = useRouter()
  const route = useRoute()
  const store = useStore()

  const cart = inject('cart')

  const user = computed(() => store.getters['auth/user'])
  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const routeNames = computed(() => route.matched.map(({ name }) => name ).filter((name) => name ))
  const cartCount = computed(() => cart.value?.reduce((acc, curr) => acc + Number(curr.count), 0))

  const onNavBtnClick = (name) => router.push({ name })
  const onLoginClick = () => router.push('/login')
  const onLogoutClick = async () => {
    await store.dispatch('auth/signOut')

    router.push('/login')
  }
</script>

<template>
  <v-app-bar :elevation="2">
    <v-app-bar-title class="text-left">
      <v-icon
        icon="mdi-store"
        class="mr-2"
      ></v-icon>
      {{ storeInfo.name }}
    </v-app-bar-title>

    <v-spacer />

    <v-btn
      class="mr-4"
      icon="mdi-storefront"
      variant="outlined"
      :title="$t('Products')"
      :active="routeNames.includes('visitProducts')"
      @click="onNavBtnClick('visitProducts')"
    ></v-btn>

    <template v-if="cartCount">
      <v-badge
        :content="cartCount"
        color="red"
        offset-x="16"
      >
        <v-btn
          class="mr-4"
          variant="outlined"
          icon="mdi-cart"
          :title="$t('Cart')"
          :active="routeNames.includes('visitCart')"
          @click="onNavBtnClick('visitCart')"
        >
        </v-btn>
      </v-badge>
    </template>
    <template v-else>
      <v-btn
        class="mr-4"
        icon="mdi-cart"
        variant="outlined"
        :title="$t('Cart')"
        :active="routeNames.includes('visitCart')"
        @click="onNavBtnClick('visitCart')"
      ></v-btn>
    </template>

    <v-btn
      v-if="!isAuthenticated"
      class="mr-5"
      variant="outlined"
      @click="onLoginClick"
    >
      {{ $t('Login') }}
    </v-btn>
    <v-btn
      v-if="isAuthenticated"
      class="mr-5"
      variant="outlined"
      @click="onLogoutClick"
      :title="user?.email"
    >
      {{ $t('Logout') }}
    </v-btn>
  </v-app-bar>
</template>
