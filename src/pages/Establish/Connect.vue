<script setup>
  import { inject, ref, onMounted, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import QRCode from 'qrcode'

  import Host from '@/utils/Service/Host.js'

  const emit = defineEmits(['connect', 'disconnect'])

  const { VITE_GOOGLE_MAPS_MAP_ID } = import.meta.env
  const store = inject('storeInfo')
  const position = inject('storePosition')
  const vStore = useStore()
  const router = useRouter()

  const isConnecting = ref(false)
  const appUrl = ref(null)
  const qrcodeUrl = ref(null)
  const copyIcon = ref('mdi-content-copy')
  const showQRcodeDialog = ref(false)

  let advancedMarker

  const genQRcode = async (url) => new Promise((resolve, reject) => QRCode.toDataURL(url, (err, dataUrl) => err ? reject(err) : resolve(dataUrl)))
  const connectTunnel = async ({ storeId, lat, lng }) => vStore.dispatch('cloud/storeConnect', { storeId, lat, lng })
  const createHost = ({ storeId, tunnel }) => new Host({ storeId, tunnel })
  const onConnectClick = async () => {
    const { id: storeId } = store.value
    const { lat, lng } = position.value

    isConnecting.value = true

    try {
      const tunnel = await connectTunnel({ storeId, lat, lng })
      const host = createHost({ storeId, tunnel })

      emit('connect', host)

      const path = router.resolve({ name: 'visit', params: { id: storeId } }).href
      const url = `${location.origin}${path}`

      appUrl.value = url
      qrcodeUrl.value = await genQRcode(url)
    } catch (err) {
      console.error('CloudConnection connect fail:', err)
    } finally {
      isConnecting.value = false
    }
  }
  const onDisconnectClick = () => {
    vStore.dispatch('cloud/disconnect')

    emit('disconnect')

    appUrl.value = null
    qrcodeUrl.value = null
  }
  const onCopyClick = () => {
    console.log('onCopyClick', appUrl.value)
    navigator.clipboard.writeText(appUrl.value)
      .then(() => {
        copyIcon.value = 'mdi-check-bold'

        setTimeout(() => copyIcon.value = 'mdi-content-copy', 1.5 * 1000);
      });
  }
  const onQRCodeClick = () => showQRcodeDialog.value = true

  onMounted(async () => {
    const mapElement = document.getElementById('map')
    const map = new google.maps.Map(mapElement, {
      streetViewControl: false,
      mapTypeControl: false,
      zoom: 18,
      center: position.value,
      mapId: VITE_GOOGLE_MAPS_MAP_ID,
    })

    map.setOptions({ draggable: false })

    const markerRootElement = document.createElement('div');
    // markerRootElement.textContent = '📍'
    markerRootElement.style.backgroundImage = 'url("/thumbtack.svg")'
    markerRootElement.style.width = '11px'
    markerRootElement.style.height = '20px'

    advancedMarker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: position.value,
      content: markerRootElement,
    })
  })

  onUnmounted(() => {
    if (advancedMarker) {
      advancedMarker.map = null
      advancedMarker = null
    }
  })
</script>

<template>
  <v-container>
    <v-row v-if="store" class="pt-8">
      <v-col cols="12">
        <div id="map" style="width: 100%; height: 400px;"></div>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12" md="4">
            <v-btn
              v-if="!appUrl"
              @click="onConnectClick"
              :disabled="isConnecting"
              color="green"
              class="h-56"
              block
            >
              <template slot:prepend v-if="isConnecting">
                <v-progress-circular
                  color="primary"
                  indeterminate
                  size="16"
                  width="2"
                  class="mr-2"
                ></v-progress-circular>
              </template>
              {{ $t('Connect') }}
            </v-btn>
            <v-btn
              v-if="appUrl"
              @click="onDisconnectClick"
              class="h-56"
              color="red"
              block
            >{{ $t('Disconnect') }}</v-btn>
          </v-col>
          <v-col cols="12" md="8"
            v-if="appUrl"
          >
            <v-row>
              <v-col cols="2">
                <v-btn
                  @click="onQRCodeClick"
                  class="h-56"
                  block
                >
                  <template v-slot:default>
                    <v-icon size="40" icon="mdi-qrcode"></v-icon>
                  </template>
                </v-btn>
              </v-col>
              <v-col cols="10">
                <v-text-field
                  v-model="appUrl"
                  label="URL"
                  hide-details
                  readonly
                >
                  <template v-slot:append-inner>
                    <v-icon size="32"
                      :icon="copyIcon"
                      @click="onCopyClick"
                    ></v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog
      v-model="showQRcodeDialog"
      max-width="400px"
      @click:outside="showQRcodeDialog = false"
    >
      <v-card>
        <v-img :src="qrcodeUrl" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style lang="scss" scoped>
.h-56 {
  height: 56px;
}
</style>
