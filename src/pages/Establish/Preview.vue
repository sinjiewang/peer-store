<script setup>
  import { inject } from 'vue'
  import List from '@/pages/Visit/List.vue'

  const service = inject('storeService')

</script>

<template>
  <List :service="service" />
</template>
