<script setup>
  import { ref } from 'vue'

  defineProps({
    drawer: {
      type: Boolean,
      required: true,
    },
  })

  const emit = defineEmits(['update:drawer'])

  const navigation = ref([
    {
      text: 'Browse',
      path: '/browse',
      icon: 'mdi-search-web',
    },
    {
      text: 'Store',
      path: '/store',
      icon: 'mdi-store',
    },
    // {
    //   text: 'Posts',
    //   path: '/posts',
    //   icon: 'mdi-logout',
    // },
  ])
</script>

<template>
  <v-navigation-drawer
    :model-value="drawer"
    :scrim="false"
  >
    <v-list
      class="text-left"
      @click="() => emit('update:drawer', false)"
    >
      <v-list-item
        v-for="(item, index) in navigation"
        :key="index"
        :to="item.path"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
