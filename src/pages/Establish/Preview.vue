<script setup>
  import { inject } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t: $t } = useI18n()
  const service = inject('storeService')

</script>

<template>
  <div>
    Preview page
  </div>
</template>
