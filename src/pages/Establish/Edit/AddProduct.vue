<script setup>
  import { ref, inject, toRaw } from 'vue'

  import Form from './ProductForm.vue'

  const service = inject('storeService')
  const form = ref(null)
  const product = ref({})
  const valid = ref(false)
  const showDisable = ref(false)
  const showLoading = ref(false)
  const showSuccess = ref(false)

  const onAddClick = async () => {
    const data = toRaw(product.value)

    showDisable.value = true
    showLoading.value = true

    try {
      await service.value.createProduct(data)
    } catch (err) {
      console.warn('service.createProduct failed', err)
    } finally {
      showDisable.value = false
      showLoading.value = false
    }

    valid.value = false
    showSuccess.value = true
    form.value?.clean()
    product.value = {}
    setTimeout(() => showSuccess.value = false, 4000)

  }
  const onChange = () => {
    valid.value = !!product.value.name
  }
</script>

<template>
  <v-form>
    <Form
      ref="form"
      v-model:product="product"
      @change:product="onChange"
    >
      <template v-slot:append>
        <v-btn
          :loading="showLoading"
          :disabled="showDisable || !valid"
          @click="onAddClick"
          color="primary"
          block
        >
          <template slot:prepend v-if="showSuccess">
            <v-icon icon="mdi-check"></v-icon>
          </template>
          {{ $t('Add') }}
        </v-btn>
      </template>
    </Form>
  </v-form>
</template>

<style lang="scss" scoped>
.product-settings-card {
  min-height: 220px;
}
.img-add-btn {
  height: 60px;
}
</style>
