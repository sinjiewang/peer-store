<script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
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
    class="add-button"
    prepend-icon="mdi-store-plus"
    variant="outlined"
    block
    @click="onCreateClick"
  >
    <span class="hidden-sm">{{ $t('New Store') }}</span>
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
.add-button {
  height: 80px;
  font-size: 1.5rem;
}
</style>
