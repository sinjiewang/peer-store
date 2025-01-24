<script setup>
  import { ref, toRefs, watch, onMounted } from 'vue'
  import DOMPurify from 'dompurify'

  import Editor from '@/components/Editor.vue'

  const props = defineProps({
    product: {
      type: Object,
      default: {},
    },
  })
  const emit = defineEmits(['update:product', 'change:product'])

  const { product } = toRefs(props)
  const tab = ref('tab-1')
  const productDesc = ref('')
  const productSortDesc = ref('')
  const quantityRadios = ref(null)
  const productQuantity = ref(null)
  const productDescEditor = ref(null)
  const productSortDescEditor = ref(null)

  const clean = () => {
    tab.value = 'tab-1'
    productDesc.value = ''
    productSortDesc.value = ''
    quantityRadios.value = null
    productQuantity.value = null
    productDescEditor.value?.clean()
    productSortDescEditor.value?.clean()
  }

  watch(productDesc, (value) => {
    emit('update:product', {
      ...product.value,
      desc: DOMPurify.sanitize(value, { USE_PROFILES: { html: true } }),
    })
    emit('change:product')
  })
  watch(productSortDesc, (value) => {
    emit('update:product', {
      ...product.value,
      sortDesc: DOMPurify.sanitize(value, { USE_PROFILES: { html: true } }),
    })
    emit('change:product')
  })
  watch(quantityRadios, (value) => {
    const quantity = value === 'infinity' ? Infinity : Number(productQuantity.value)

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

  onMounted(() => {
    if (product.value.quantity === Infinity) {
      quantityRadios.value = 'infinity'
    } else if (product.value.quantity !== undefined) {
      quantityRadios.value = 'infinity'
    }
    productDescEditor.value?.set(product.value.desc)
    productSortDescEditor.value?.set(product.value.sortDesc)
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
        <v-card variant="tonal">
          <v-card-text>
            <v-row>
              <v-col cols="4" md="12">
                <v-btn
                  class="img-add-btn"
                  variant="outlined"
                  block
                >
                  <template v-slot:prepend>
                    <v-icon
                      icon="mdi-image-plus"
                      size="36"
                    >
                    </v-icon>
                  </template>
                </v-btn>
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
                            value="infinity"
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
              ref="productSortDescEditor"
              v-model:content="productSortDesc"
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
</style>
