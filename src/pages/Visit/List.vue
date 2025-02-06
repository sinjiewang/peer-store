<script setup>
  import { ref, toRefs, onMounted } from 'vue'

  const props = defineProps({
    service: {
      type: Object,
      required: true,
    },
  })

  const { service } = toRefs(props)
  const products = ref([])
  const containerRef = ref(null)
  const selectedProduct = ref(null)
  const tab = ref('list')

  const LIMIT = 12
  let nextToken

  const queryProducts = async ({ limit=LIMIT }={}) => {
    const { items, next } = await service.value.listProducts({ limit, next: nextToken })

    products.value = [
      ...products.value,
      ...items,
    ]
    nextToken = next
  }
  const onScroll = async (event) => {
    const container = event.target;
    const isBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50

    if ( isBottom && nextToken) queryProducts()
  }

  const onMoreClick = (item) => {
    selectedProduct.value = item
    tab.value = 'item'
  }
  const onReturnClick = () => tab.value = 'list'

  onMounted(async () => {
    await queryProducts()
  })
</script>

<template>
  <v-container
    class="h-100 overflow-y-auto"
    ref="containerRef"
    @scroll="onScroll"
  >
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="list">
      <v-row>
        <v-col cols="12" md="4"
          v-for="item in products"
          :key=item.id
        >
          <v-card
            variant="tonal"
          >
            <v-img v-if="item.thumbnail"
              :src="item.thumbnail"
              height="150px"
              aspect-ratio="16/9"
              cover
            ></v-img>
            <v-img v-else
              height="180px"
              aspect-ratio="16/9"
              class="d-flex align-center justify-center img-border"
              cover
            >
              <template #default>
                <v-icon icon="mdi-image" size="48" color="grey"></v-icon>
              </template>
            </v-img>

            <v-card-title>
              {{ item.name }}
            </v-card-title>

            <v-card-subtitle>
              <div class="align-left ql-editor"
                v-html="item.shortDesc"
              ></div>
            </v-card-subtitle>

            <v-card-actions>
              <div v-if="item.price !== undefined"
                class="ml-3"
              >NTD {{ item.price }}</div>
              <v-spacer></v-spacer>
              <v-btn
                :text="$t('More') + '>'"
                @click="onMoreClick(item)"
                variant="plain"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      </v-tabs-window-item>

      <v-tabs-window-item value="item">
        <v-card
          variant="tonal"
        >
          <v-card-title class="text-left">
            <v-btn
              icon="mdi-keyboard-return"
              variant="outlined"
              @click="onReturnClick"
            ></v-btn>
          </v-card-title>

          <v-card-text v-if="selectedProduct">
            <v-row class="pt-3">
              <v-col col="12" sm="6">
                <v-img v-if="selectedProduct.image"
                  :src="selectedProduct.image"
                  height="400px"
                  aspect-ratio="16/9"
                  cover
                ></v-img>
                <v-img v-else
                  height="400px"
                  aspect-ratio="16/9"
                  class="d-flex align-center justify-center img-detail-border"
                  cover
                >
                  <template #default>
                    <v-icon icon="mdi-image" size="48" color="grey"></v-icon>
                  </template>
                </v-img>
              </v-col>
              <v-col col="12" sm="6">
                <v-row class="align-left ql-edit">
                  <v-col cols="12" class="text-h3">
                    {{ selectedProduct.name }}
                  </v-col>
                  <v-col cols="12" class="text-subtitle-2 pt-0">
                    <!-- <v-rating
                      :length="5"
                      :size="18"
                      :model-value="5"
                      active-color="warning"
                      readonly
                    /> -->
                    <div>NTD {{ selectedProduct.price }}</div>
                  </v-col>
                  <v-col cols="12" v-html="selectedProduct.desc"></v-col>
                  <v-col cols="6">
                    <div v-if="selectedProduct.quantity === Infinity">{{ $t('In stock') }}</div>
                    <div v-else-if="selectedProduct.quantity !== undefined">{{ $t('Stock') + ': ' + selectedProduct.quantity }}</div>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      :text="$t('Buy')"
                      @click="onBuyClick(item)"
                      variant="tonal"
                      width="200"
                      color="primary"
                      block
                    ></v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<style lang="scss" scoped>
.img-border {
  border-bottom: #000 1px solid;
}
.img-detail-border {
  border: #000 1px solid;
  border-radius: 4px;
}
.align-left {
  text-align: left;
}
</style>
