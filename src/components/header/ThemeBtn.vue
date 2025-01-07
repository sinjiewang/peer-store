<script setup>
  import { ref, mergeProps } from 'vue'
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  const dataTheme = document.documentElement.getAttribute('data-theme')
  const currentTheme = ref(dataTheme)

  function onThemeClick() {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', currentTheme.value)
    theme.global.name.value = currentTheme.value
    localStorage.setItem('theme', currentTheme.value)
  }
</script>

<template>
  <v-tooltip location="top" class="mr-3">
    <template v-slot:activator="{ props: tooltip }">
      <v-btn
        :icon="currentTheme === 'dark' ? 'mdi-brightness-2' : 'mdi-brightness-7'"
        v-bind="mergeProps(tooltip)"
        @click="onThemeClick"
      >
      </v-btn>
    </template>
    <span>{{ $t('Theme') }}</span>
  </v-tooltip>
</template>
