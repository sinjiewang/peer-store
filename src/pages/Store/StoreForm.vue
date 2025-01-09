<script setup>
  import { ref, watch, toRefs, defineEmits, nextTick, inject } from 'vue'
  import { createStore as createMutation, updateStore as updateMutation } from '@/graphql/mutations'

  const props = defineProps({
    store: {
      type: Object,
      default: () => ({}),
    },
  })
  const emit = defineEmits(['update:store'])

  const client = inject('graphqlClient')
  const { store } = toRefs(props)
  const clone = ref(null)
  const isDirty = ref(false)

  const setIsDirty = () => isDirty.value = true
  const onResetClick = (newVal) => {
    clone.value = { ...store.value }
    isDirty.value = false
  }
  const onSaveClick = () => {
    if (clone.value.id) {
      updateStore(clone.value)
    } else {
      createStore(clone.value)
    }
  }
  const createStore = async (input) => {
    try {
      const { name, description, address, zip, email, phone, merchantID, hashKey, hashIV } = input
      const result = await client.graphql({
        query: createMutation,
        variables: { input: {
          name, description, address, zip, email, phone, merchantID, hashKey, hashIV,
        }},
      })

      emit('update:store', result.data.createStore)
    } catch (err) {
      console.error('Error creating store:', err)
    }
  }
  const updateStore = async (input) => {
    try {
      const { id, name, description, address, zip, email, phone, merchantID, hashKey, hashIV } = input
      const result = await client.graphql({
        query: updateMutation,
        variables: { input: {
          id, name, description, address, zip, email, phone, merchantID, hashKey, hashIV,
        }},
      })

      emit('update:store', result.data.updateStore)
    } catch (err) {
      console.error('Error updating store:', err)
    }
  }
  const displayDate = (isoStr) => new Date(isoStr).toLocaleString()

  watch(store, (newVal) => newVal && onResetClick())
</script>

<template>
  <v-form
    v-if="clone"
    @input="setIsDirty"
    class="h-100 text-left"
  >
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            v-model="clone.name"
            :label="$t('Store name')"
            hide-details="auto"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="clone.description"
            :label="$t('Store description')"
          ></v-textarea>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="clone.email"
            :label="$t('Email')"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="clone.phone"
            :label="$t('Phone')"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="9">
          <v-text-field
            v-model="clone.address"
            :label="$t('Address')"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="clone.zip"
            :label="$t('ZIP code')"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
        >
          <v-icon icon="mdi-alert-circle-outline" class="mr-2"></v-icon>{{ $t('Payment Gateway') }}
        </v-col>
        <v-col
          cols="6"
          md="4"
        >
          <v-text-field
            v-model="clone.merchantID"
            label="MerchantID"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col
          cols="6"
          md="4"
        >
          <v-text-field
            v-model="clone.hashKey"
            label="HashKey"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col
          cols="6"
          md="4"
        >
          <v-text-field
            v-model="clone.hashIV"
            label="HashIV"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-row  class="ma-0">
          <v-col
            cols="12"
            md="6"
          >
            <v-row>
              <v-col
                v-if="clone.createdAt"
                cols="12"
              >
                <v-row>
                  <v-col cols="4">
                    {{ $t('Created at') }}:
                  </v-col>
                  <v-col cols="8">
                    {{ displayDate(clone.createdAt) }}
                  </v-col>
                  <v-col cols="4">
                    {{ $t('Updated at') }}:
                  </v-col>
                  <v-col cols="8">
                    {{ displayDate(clone.updatedAt) }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="d-flex justify-end align-end"
          >
            <v-btn
              v-if="clone.id"
              class="mr-2"
              color="grey-darken-3"
              :disabled="!isDirty"
              @click="onResetClick(store)"
            >{{ $t('Reset') }}</v-btn>
            <v-btn
              color="primary"
              :disabled="!isDirty"
              @click="onSaveClick"
            >{{ $t('Save') }}</v-btn>
          </v-col>
        </v-row>
      </v-row>
    </v-container>
  </v-form>
</template>