<script setup>
  import { useRouter } from 'vue-router'

  defineProps({
    store: {
      type: Object,
      default: () => null,
    },
  })

  const router = useRouter()
  const handleBtnClick = (name) => router.push({ name })
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
      icon="mdi-connection"
      variant="outlined"
      :title="$t('Connect')"
      @click="handleBtnClick('establishConnect')"
    ></v-btn>
    <v-btn
      class="mr-4"
      icon="mdi-store-edit"
      variant="outlined"
      :title="$t('Edit')"
      @click="handleBtnClick('establishEdit')"
    ></v-btn>
    <v-btn
      class="mr-4"
      icon="mdi-storefront"
      variant="outlined"
      :title="$t('Preview')"
      @click="handleBtnClick('establishPreview')"
    ></v-btn>
  </v-app-bar>
</template>
