<script setup>
  import { ref, toRefs, inject, watch, onMounted } from 'vue'
  import DOMPurify from 'dompurify'
  import formatBytes from '@/utils/formatBytes.js'

  import Editor from '@/components/Editor.vue'

  const props = defineProps({
    product: {
      type: Object,
      default: {},
    },
  })
  const emit = defineEmits(['update:product', 'change:product'])

  const service = inject('storeService')
  const { product } = toRefs(props)
  const tab = ref('tab-1')
  const productDesc = ref('')
  const productShortDesc = ref('')
  const quantityRadios = ref(null)
  const productQuantity = ref(null)
  const productDescEditor = ref(null)
  const productShortDescEditor = ref(null)
  const inputFile = ref()
  const productImage = ref(null)

  const clean = () => {
    tab.value = 'tab-1'
    productImage.value = null
    productDesc.value = ''
    productShortDesc.value = ''
    quantityRadios.value = null
    productQuantity.value = null
    productDescEditor.value?.clean()
    productShortDescEditor.value?.clean()
  }
  const onAddImageClick = () => inputFile.value.click()
  const onFileSelected = async (event) => {
    const file = event.target.files[0]
    const fileInStore = await service.value.createImage(file)

    productImage.value = fileInStore
  }
  const onRemoveImageClick = () => productImage.value = null

  watch(productImage, (value) => {
    emit('update:product', {
      ...product.value,
      image: value?.id,
      thumbnail: value?.thumbnailId,
    })
    emit('change:product')
  })
  watch(productDesc, (value) => {
    emit('update:product', {
      ...product.value,
      desc: DOMPurify.sanitize(value, { USE_PROFILES: { html: true } }),
    })
    emit('change:product')
  })
  watch(productShortDesc, (value) => {
    emit('update:product', {
      ...product.value,
      shortDesc: DOMPurify.sanitize(value, { USE_PROFILES: { html: true } }),
    })
    emit('change:product')
  })
  watch(quantityRadios, (value) => {
    const quantity = value === 'Infinity' ? value : Number(productQuantity.value)

    emit('update:product', {
      ...product.value,
      quantity,
    })
    emit('change:product')
  })
  watch(productQuantity, (value) => {
    if (quantityRadios.value === 'finity') {
      emit('update:product', {
        ...product.value,
        quantity: Number(value),
      })
      emit('change:product')
    }
  })

  defineExpose({
    clean,
  })

  onMounted(async () => {
    if (product.value.quantity === 'Infinity' || product.value.quantity === undefined) {
      quantityRadios.value = 'Infinity'
    } else {
      quantityRadios.value = 'finity'
      productQuantity.value = product.value.quantity
    }
    productDescEditor.value?.set(product.value.desc)
    productShortDescEditor.value?.set(product.value.shortDesc)

    if (product.value.image) {
      productImage.value = await service.value.getImage(product.value.image)
    }
  })
</script>

<template>
  <v-container class="text-left">
    <v-row>
      <v-col
        cols="12"
        md="4"
        :order-md="2"
      >
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="4" md="12">
                <template v-if="productImage">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card v-bind="props">
                      <v-img :src="productImage?.src" cover>
                        <div
                          v-if="isHovering"
                          class="d-flex justify-center align-center"
                          style="height: 100%;"
                        >
                          <v-icon
                            icon="mdi-image-remove"
                            color="red-accent-4"
                            size="36"
                            @click="onRemoveImageClick"
                          >
                          </v-icon>
                        </div>
                      </v-img>
                    </v-card>
                  </v-hover>
                  <v-row class="mt-0">
                    <v-col cols="12">
                      <span class="mr-1">{{ $t('File') }}:</span>
                      {{ productImage.name }}
                      <br>
                      <span class="mr-1">{{ $t('Size') }}:</span>
                      {{ formatBytes(productImage.size) }}
                      <br>
                      <span class="mr-1">{{ $t('Resolution') }}:</span>
                      {{ `${productImage.width} * ${productImage.height}` }}
                    </v-col>
                  </v-row>
                </template>
                <template v-else>
                  <v-btn
                    @click="onAddImageClick"
                    class="h-56"
                    variant="outlined"
                    block
                  >
                    <v-icon
                      icon="mdi-image-plus"
                      size="36"
                    >
                    </v-icon>
                    <input
                      class="d-none"
                      type="file"
                      ref="inputFile"
                      @change="onFileSelected"
                    />
                  </v-btn>
                </template>
              </v-col>
              <v-col cols="8" md="12"></v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="8"
        :order-md="1"
      >
        <v-row>
          <v-col cols="12" class="pb-0">
            {{ $t('Product name') }}
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="product.name"
              :rules="[v => !!v || $t('Required')]"
              @update:modelValue="emit('change:product')"
              hide-details="auto"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pb-0">
            {{ $t('Product description') }}
          </v-col>
          <v-col
            cols="12"
          >
            <Editor
              ref="productDescEditor"
              v-model:content="productDesc"
              class="product-desc-editor"
            />
          </v-col>
          <v-col cols="12" class="pb-0">
            {{ $t('Product settings') }}
          </v-col>
          <v-col cols="12">
            <v-card class="product-settings-card" variant="outlined">
              <v-tabs
                v-model="tab"
                color="blue-grey"
              >
                <v-tab :text="$t('General')" value="tab-1"></v-tab>
                <v-tab :text="$t('Inventory')" value="tab-2"></v-tab>
              </v-tabs>
              <v-card-text>
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item value="tab-1">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="product.price"
                          :label="$t('Price')"
                          hint="NT$ - TWD"
                          type="number"
                          hide-details="auto"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-tabs-window-item>
                  <v-tabs-window-item value="tab-2">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="product.sku"
                          :label="$t('SKU')"
                          :hint="$t('Stock Keeping Unit')"
                          hide-details="auto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="product.gui"
                          :label="$t('GTIN, UPC, EAN, or ISBN')"
                          hide-details="auto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        {{ $t('Quantity') }}
                      </v-col>
                      <v-col cols="12">
                        <v-radio-group
                          v-model="quantityRadios"
                        >
                          <v-radio
                            value="Infinity"
                            :label="$t('In stock')"
                          ></v-radio>
                          <v-radio
                            value="finity"
                          >
                            <template v-slot:label>
                              <v-text-field
                                v-model="productQuantity"
                                type="number"
                                width="100"
                                hide-details="auto"
                              ></v-text-field>
                            </template>
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" class="pb-0">
            {{ $t('Product short description') }}
          </v-col>
          <v-col
            cols="12"
          >
            <Editor
              ref="productShortDescEditor"
              v-model:content="productShortDesc"
              class="product-short-desc-editor"
            />
          </v-col>
          <v-col cols="12">
            <slot name="append"></slot>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
:deep(.product-desc-editor) {
  height: 200px;
}
:deep(.product-short-desc-editor) {
  height: 100px;
}
.h-56 {
  height: 56px;
}
</style>
