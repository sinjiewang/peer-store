<script setup>
  import { ref, inject, onMounted, nextTick, toRaw } from 'vue'
  import { useI18n } from 'vue-i18n'

  import RemoveDialog from '@/components/ConfirmDialog.vue'
  import Form from './ProductForm.vue'

  const { t: $t } = useI18n()

  const LIMIT = 15
  const service = inject('storeService')
  const products = ref([])
  const loading = ref(false)
  const containerRef = ref(null)
  const removeDialog = ref(null)
  const tab = ref('table')
  const selectedProduct = ref(null)
  const deleteProduct = ref(null)

  const headers = [
    { title: 'Name', key: 'name' },
    // { title: 'Price', key: 'price', align: 'center' },
    // { title: 'Price', key: '', align: 'center' },
    { title: 'SKU', key: 'sku', align: 'center' },
    { title: 'Quantity', key: 'quantity', align: 'center' },
    {
      title: 'Last updated',
      key: 'updatedTime',
      align: 'end',
      value: item => new Date(item.createdTime).toLocaleString(),
    },
    { title: 'Operate', key: 'operate', align: 'center' },
  ]

  let nextToken

  const queryProducts = async ({ limit=LIMIT }={}) => {
    const { items, next: token } = await service.value.listProducts({ limit, next: nextToken })

    products.value = [
      ...products.value,
      ...items,
    ]
    nextToken = token
  }
  const onScroll = async (event) => {
    const container = event.target;
    const isBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50

    if ( isBottom && nextToken) queryProducts()
  }
  const onEditClick = (item) => {
    selectedProduct.value = item
    tab.value = 'edit'
  }
  const onReturnClick = () => {
    selectedProduct.value = null
    tab.value = 'table'
  }
  const onSaveClick = async () => {
    const data = toRaw(selectedProduct.value)
    const { id } = data

    await service.value.updateProduct(id, data)

    const index = products.value.findIndex((product) => product.id === id)

    products.value[index] = data

    onReturnClick()
  }
  const onChange = () => {}

  const confirmBtn = {
    label: $t('Delete'),
    color: 'red',
    callback: (item) => removeProduct(item.id),
  }
  const onDeleteClick = (item) => {
    deleteProduct.value = item

    removeDialog.value.open()
  }
  const removeProduct = async (id) => {
    await service.value.deleteProduct(id)

    products.value = products.value.filter((product) => id !== product.id)

    nextTick(() => {
      const container = containerRef.value
      const hasScrollBar = container.scrollHeight > container.clientHeight

      if (!hasScrollBar && nextToken) queryProducts()
    })
  }

  onMounted(async () => {
    loading.value = true

    try {
      await queryProducts()
    } catch (err) {
      console.warn('queryProducts failed', err)
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div @scroll="onScroll" ref="containerRef">
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="table">
        <v-data-table
          :headers="headers"
          :loading="loading"
          :items="products"
          :items-per-page="-1"
          hide-default-footer
        >
          <template v-slot:[`item.name`]="{ item }">
            <div class="text-start">{{ item.name }}</div>
          </template>
          <template v-slot:[`item.quantity`]="{ item }">
            <div>{{ item.quantity === 'Infinity' ? $t('In stock') : item.quantity }}</div>
          </template>
          <template v-slot:[`item.operate`]="{ item }">
            <v-btn
              icon="mdi-square-edit-outline"
              @click="onEditClick(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              @click="onDeleteClick(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-tabs-window-item>

      <v-tabs-window-item value="edit">
        <v-row>
          <v-col cols="12">
            <v-container class="text-left pb-0">
            <v-btn
              icon="mdi-keyboard-return"
              variant="outlined"
              @click="onReturnClick"
            ></v-btn>
            </v-container>
          </v-col>
          <v-col cols="12">
            <Form
              v-if="selectedProduct"
              class="pt-0"
              ref="form"
              v-model:product="selectedProduct"
              @change:product="onChange"
            >
              <template v-slot:append>
                <v-btn
                  @click="onSaveClick"
                  color="primary"
                  block
                >{{ $t('Save') }}</v-btn>
              </template>
            </Form>
          </v-col>
        </v-row>
      </v-tabs-window-item>
    </v-tabs-window>

    <RemoveDialog
      ref="removeDialog"
      :item="deleteProduct"
      :confirmBtn="confirmBtn"
    >
      <template v-slot:content>
        <div>{{ $t('Are you sure you want to delete?') }}</div>
        <div class="mt-2 text-h5">{{ deleteProduct.name }}</div>
      </template>
    </RemoveDialog>
  </div>
</template>

<style lang="scss" scoped>

</style>
