<script setup>
  import { inject, ref, onMounted, onUnmounted } from 'vue'
  import { useStore } from 'vuex'

  import Server from '@/utils/Service/Server.js'

  const emit = defineEmits(['connect', 'disconnect'])

  const { VITE_GOOGLE_MAPS_MAP_ID } = import.meta.env
  const store = inject('storeInfo')
  const position = inject('storePosition')
  const vStore = useStore()
  const isConnecting = ref(false)

  let advancedMarker

  const connectTunnel = async ({ storeId, lat, lng }) => vStore.dispatch('cloud/storeConnect', { storeId, lat, lng })
  const createServer = ({ storeId, tunnel }) => new Server({ storeId, tunnel })
  const onConnectClick = async () => {
    const { id: storeId } = store.value
    const { lat, lng } = position.value

    isConnecting.value = true

    try {
      const tunnel = await connectTunnel({ storeId, lat, lng })
      const server = createServer({ storeId, tunnel })

      emit('connect', server)
    } catch (err) {
      console.error('CloudConnection connect fail:', err)
    } finally {
      isConnecting.value = false
    }
  }
  const onDisconnectClick = () => {
    vStore.dispatch('cloud/disconnect')

    emit('disconnect')
  }

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
      <v-col cols="12" md="4">
        <v-btn
          v-if="!store.state"
          @click="onConnectClick"
          :disabled="isConnecting"
          color="green"
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
          {{ $t('Connect') }}</v-btn>
        <v-btn
          v-if="store.state"
          @click="onDisconnectClick"
          color="red"
          block
        >{{ $t('Disconnect') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
