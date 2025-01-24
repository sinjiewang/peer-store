<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'

  defineProps({
    stores: {
      type: Array,
      default: () => [],
    },
    selectedStore: {
      type: Object,
      default: () => null,
    },
  })

  const vxStore = useStore()
  const user = computed(() => vxStore.getters['auth/user'])
  const emit = defineEmits(['update:store', 'remove:store'])

  const onStoreClick = (store) => emit('update:store', store)
  const onRemoveStore = (store) => emit('remove:store', store)
  const onCreateClick = () => emit('update:store', {
    id: '',
    name: '',
    description: '',
    address: '',
    email: user.value.email,
    phone: '',
    merchantID: '',
    hashKey: '',
    hashIV: '',
  })
</script>

<template>
  <v-btn
    class="h-80"
    variant="outlined"
    block
    @click="onCreateClick"
  >
    <template v-slot:prepend>
      <v-icon
        icon="mdi-store-plus"
        size="36"
      >
      </v-icon>
    </template>
    <span class="hidden-sm add-text">{{ $t('New Store') }}</span>
  </v-btn>
  <v-list class="text-left">
    <v-hover v-for="(store, index) in stores" :key="store.id">
      <template v-slot:default="{ isHovering, props }">
        <v-list-item
          v-bind="props"
          :active="selectedStore && store.id === selectedStore.id"
          @click="onStoreClick(store)"
          link
        >
          <template v-slot:prepend>
            <v-icon
              icon="mdi-circle-small"
              class="mr-2"
              :color="store.state === 'online' ? 'green' : ''"
              size="48"
            ></v-icon>
          </template>
          <template v-slot:title>
            <span :title="store.name">{{ store.name }}</span>
          </template>
          <template v-slot:append>
            <v-btn
              v-if="isHovering"
              icon="mdi-delete"
              variant="text"
              @click="onRemoveStore(store)"
            ></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-hover>
  </v-list>
</template>

<style scoped lang="scss">
.h-80 {
  height: 80px;
}
.add-text {
  font-size: 1.2rem;
}
</style>
