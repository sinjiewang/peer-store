<script setup>
  import { ref, toRefs, inject, computed, watch, onMounted } from 'vue'

  const props = defineProps({
    service: {
      type: Object,
      required: true,
    },
    refreshCart: {
      type: Function,
      required: true
    },
  })

  const cart = inject('cart')

  const { service } = toRefs(props)
  const showLoading = ref(false)

  const roundTo = (num, decimals=2) => {
    const factor = Math.pow(10, decimals)

    return Math.round(num * factor) / factor
  }
  const total = computed(() => roundTo(cart.value.reduce((acc, curr) =>
    (curr.count > 0) ? (acc + Number(curr.count) * (curr.price || 0)) : acc, 0)))
  const disableCheckout = computed(() => cart.value.length <= 0)

  const onPlusClick = async ({ productId }, index) => {
    await service.value.increaseToCart({ productId })

    cart.value[index].count += 1
  }
  const onMinusClick = async ({ productId }, index) => {
    const { count } = await service.value.decreaseFromCart({ productId })

    if (count > 0) cart.value[index].count = count
    else cart.value.splice(index, 1)
  }
  const onDeleteClick = async ({ id }, index) => {
    await service.value.deleteCart(id)

    cart.value.splice(index, 1)
  }
  const updateItemsThumbnail = () => {
    cart.value
      .filter((item) => !item.thumbnailSrc)
      .forEach(async (item) => {
        try {
          const { src } = await service.value.getImage(item.thumbnail)

          item.thumbnailSrc = src
        } catch (err) {
          console.warn('service.getImage failed', item.thumbnail, err)
        }
      })
  }

  watch(cart, () => updateItemsThumbnail())

  onMounted(() => {
    updateItemsThumbnail()
  })
</script>

<template>
  <v-container
    class="h-100 overflow-y-auto"
    ref="containerRef"
  >
    <v-row>
      <v-col cols="12" sm="9">
        <v-list lines="two">
          <v-list-item
            v-for="item, index in cart"
            :key="item.id"
            color="primary"
          >
            <template v-slot:prepend>
              <v-img v-if="item.thumbnailSrc"
                :src="item.thumbnailSrc"
                height="90px"
                width="160px"
                aspect-ratio="16/9"
              ></v-img>
              <v-img v-else
                height="90px"
                width="160px"
                aspect-ratio="16/9"
                class="d-flex align-center justify-center img-border"
                cover
              >
                <template #default>
                  <v-icon icon="mdi-image" size="48" color="grey"></v-icon>
                </template>
              </v-img>
            </template>

            <v-list-item-title class="ml-4 text-h5 text-left">{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle class="ml-4 text-left">NTD {{ item.price }}</v-list-item-subtitle>

            <template v-slot:append>
              <v-text-field
                class="mr-8"
                v-model="item.count"
                hide-details="auto"
                required
              >
                <template v-slot:append>
                  <v-btn
                    icon="mdi-minus"
                    variant="plain"
                    size="20"
                    :disabled="item.count <= 1"
                    @click="onMinusClick(item, index)"
                  ></v-btn>
                </template>
                <template v-slot:prepend>
                  <v-btn
                    icon="mdi-plus"
                    variant="plain"
                    size="20"
                    @click="onPlusClick(item, index)"
                  ></v-btn>
                </template>
              </v-text-field>
              <v-btn
                icon="mdi-delete"
                color="red"
                @click="onDeleteClick(item, index)"
              ></v-btn>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" sm="3">
        <v-card
          :title="$t('Cart totals')"
          class="text-left"
          variant="tonal"
        >
          <template v-slot:text>
            <v-row>
              <v-col col="4">
                <span>{{ $t('Total') }}</span>
              </v-col>
              <v-col col="8">
                <span class="font-weight-bold">NTD {{ total }}</span>
              </v-col>
            </v-row>
          </template>
          <v-card-actions>
            <v-row>
              <v-col col="12">
                <v-btn
                  :loading="showLoading"
                  :disabled="disableCheckout"
                  variant="outlined"
                  color="green"
                  block
                >{{ $t('Proceed to checkout') }}</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
