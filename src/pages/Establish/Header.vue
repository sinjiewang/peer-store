<script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  defineProps({
    store: {
      type: Object,
      default: () => null,
    },
  })

  const router = useRouter()
  const route = useRoute()

  const routeNames = computed(() => route.matched.map(({ name }) => name ).filter((name) => name ))

  const onNavBtnClick = (name) => router.push({ name })
</script>

<template>
  <v-app-bar :elevation="2">
    <v-app-bar-title class="text-left">
      <v-icon
        icon="mdi-store"
        class="mr-2"
        :color="store.state === 'online' ? 'green' : ''"
      ></v-icon>
      {{ store.name }}
    </v-app-bar-title>

    <v-spacer />

    <v-btn
      class="mr-4"
      icon="mdi-store-edit"
      variant="outlined"
      :title="$t('Edit')"
      :active="routeNames.includes('establishEdit')"
      @click="onNavBtnClick('establishEdit')"
    ></v-btn>
    <v-btn
      class="mr-4"
      icon="mdi-storefront"
      variant="outlined"
      :title="$t('Preview')"
      :active="routeNames.includes('establishPreview')"
      @click="onNavBtnClick('establishPreview')"
    ></v-btn>
    <v-btn
      class="mr-4"
      icon="mdi-connection"
      variant="outlined"
      :title="$t('Connect')"
      :active="routeNames.includes('establishConnect')"
      @click="onNavBtnClick('establishConnect')"
    ></v-btn>
  </v-app-bar>
</template>
