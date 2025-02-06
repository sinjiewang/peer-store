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
  const containerRef = ref(null)

  const onAddClick = async () => {
    const data = toRaw(product.value)

    showDisable.value = true
    showLoading.value = true

    try {
      await service.value.createProduct(data)
    } catch (err) {
      return console.warn('service.createProduct failed', err)
    } finally {
      showDisable.value = false
      showLoading.value = false
    }

    showSuccess.value = true

    setTimeout(() => {
      form.value?.clean()
      product.value = {}
      showSuccess.value = false
      valid.value = false
      containerRef.value.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }, 3000)

  }
  const onChange = () => {
    valid.value = !!product.value.name
  }
</script>

<template>
  <v-form ref="containerRef">
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
