<script setup>
  import { ref, mergeProps } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()
  const items = ref([
    {
      text: 'English',
      value: 'en',
    },
    {
      text: '繁體中文',
      value: 'zh',
    },
  ])

  function changeLanguage(lang) {
    locale.value = lang;
  }
</script>

<template>
  <div class="text-center">
    <v-menu>
      <template v-slot:activator="{ props: menu }">
        <v-tooltip location="top">
          <template v-slot:activator="{ props: tooltip }">
            <v-btn
              icon="mdi-translate"
              v-bind="mergeProps(menu, tooltip)"
            >
            </v-btn>
          </template>
          <span>{{ $t('Translations') }}</span>
        </v-tooltip>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :active="item.value === locale"
          :key="index"
          link
        >
          <v-list-item-title @click="changeLanguage(item.value)">
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>