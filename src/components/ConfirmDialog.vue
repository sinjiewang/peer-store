<script setup>
  import { ref, defineExpose } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    confirmBtn: {
      type: Object,
      default: () => ({
        label: 'Confirm',
        color: 'primary',
        callback: () => Promise.resolve(),
      }),
    },
  })

  const { t: $t } = useI18n()
  const dialog = ref(false)
  const showLoading = ref(false)

  const open = () => dialog.value = true
  const onCancelClick = () => dialog.value = false
  const onConfirmClick = async () => {
    showLoading.value = true

    try {
      await props.confirmBtn.callback()

      dialog.value = false
    } catch (err) {
      console.error('Error onConfirmClick:', err)
    } finally {
      showLoading.value = false
    }
  }

  defineExpose({
    open,
  })
</script>

<template>
  <v-dialog
    v-model="dialog"
    width="auto"
    persistent
  >
    <v-card
      max-width="400"
    >
      <template v-slot:text>
        <slot name="content"></slot>
      </template>

      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-progress-circular
          v-if="showLoading"
          color="primary"
          indeterminate
          size="20"
        ></v-progress-circular>

        <v-btn
          :disabled="showLoading"
          @click="onCancelClick"
        >
          {{ $t('Cancel') }}
        </v-btn>

        <v-btn
          @click="onConfirmClick"
          :disabled="showLoading"
          :color="confirmBtn.color"
        >
          {{ confirmBtn.label }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
