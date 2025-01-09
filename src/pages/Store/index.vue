<script setup>
  import { inject, ref, watch, onMounted } from 'vue'
  import { listStores } from '@/graphql/queries'
  import { deleteStore } from '@/graphql/mutations'
  import { useI18n } from 'vue-i18n'

  import Navigation from './Navigation.vue'
  import StoreForm from './StoreForm.vue'
  import RemoveDialog from '@/components/ConfirmDialog.vue'

  const { t: $t } = useI18n()
  const stores = ref([])
  const selectedStore = ref(null)
  const client = inject('graphqlClient')

  const selectStore = (store) => selectedStore.value = store
  const fetchStores = async () => {
    try {
      const result = await client.graphql({ query: listStores })

      stores.value = result.data.listStores.items
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } catch (err) {
      console.error('Error fetching stores:', err)
    }
  }
  const removeStore = async (item) => {
    const id = item.id
    const input = { id }

    try {
      await client.graphql({
        query: deleteStore,
        variables: { input },
      })
    } catch (err) {
      console.error('Error deleting store:', err)

      throw err
    }

    stores.value = stores.value.filter((store) => store.id !== id)

    if (selectedStore.value.id === id) {
      selectedStore.value = null
    }
  }

  const updateStore = (store) => {
    const index = stores.value.findIndex((s) => s.id === store.id)

    if (index === -1) {
      stores.value.push(store)
    } else {
      stores.value[index] = store
    }
    selectedStore.value = store
  }

  const removeDialog = ref(null)
  const removeForStore = ref(null)
  const confirmBtn = {
    label: $t('Delete'),
    color: 'red',
    callback: () => removeStore(removeForStore.value),
  }
  const showRemoveDialog = (store) => {
    removeForStore.value = store
    removeDialog.value.open()
  }

  onMounted(fetchStores)
</script>

<template>
  <v-container class="h-100 pa-0 border-left border-right">
    <v-row class="h-100 ma-0">
      <v-col cols="3" class="h-100 border-right">
        <Navigation
          :stores="stores"
          :selectedStore="selectedStore"
          @update:store="selectStore"
          @remove:store="showRemoveDialog"
        ></Navigation>
      </v-col>
      <v-col cols="9">
        <StoreForm
          class="h-100"
          :store="selectedStore"
          @update:store="updateStore"
        ></StoreForm>
      </v-col>
    </v-row>
    <RemoveDialog
      ref="removeDialog"
      :confirmBtn="confirmBtn"
    >
      <template v-slot:content>
        <div>{{ $t('Are you sure you want to delete?') }}</div>
        <div class="mt-2 text-h5">{{ removeForStore?.name }}</div>
      </template>
    </RemoveDialog>
  </v-container>
</template>

<style scoped lang="scss">
.add-button {
  height: 80px;
  font-size: 1.5rem;
}

.h-56 {
  height: 56px;
}

$navBorder: right, left;

@each $direct in $navBorder {
  .border-#{$direct} {
    border-#{$direct}-color: rgba(var(--v-border-color), var(--v-border-opacity));
    border-#{$direct}-style: solid;
    border-#{$direct}-width: thin;
  }
}

:deep(.v-list-item__prepend .v-list-item__spacer) {
  width: 0px;
}
</style>
