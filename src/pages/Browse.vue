<script setup>
  import { inject, ref, onMounted, onUnmounted } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute, useRouter } from 'vue-router'

  import { getZone } from '@/utils/positionHelper'

  const { VITE_GOOGLE_MAPS_MAP_ID } = import.meta.env

  const route = useRoute()
  const router = useRouter()
  const store = useStore()
  const position = ref(null)
  const stores = ref([])

  const advancedMarkers = new  Map()
  const listeners = []

  let map = null
  let cloudConnection

  const genAppUrl = (id) => `${location.origin}${router.resolve({ name: 'visit', params: { id } }).href}`
  const getPosstionFromUrl = () => {
    const { lat, lng } = route.query

    return lat && lng ? { lat: Number(lat), lng: Number(lng) } : null
  }
  const getPosstionFromSession = () => {
    const sessionPosition = sessionStorage.getItem('position')

    return sessionPosition ? JSON.parse(sessionPosition) : null
  }
  const setPosstionToSession = ({ lat, lng }) => sessionStorage.setItem('position', JSON.stringify({ lat, lng }))

  const connectTunnel = async ({ lat, lng }) => store.dispatch('cloud/browserConnect', { lat, lng })
  const disconnectTunnel = () => store.dispatch('cloud/disconnect')

  const getLabels = async ({ lat, lng }) => store.dispatch('geopositioning/getLabels', { lat, lng })
  const getPositionStores = async ({ positionID, nextToken }) => store.dispatch('geopositioning/getPositionStores', { positionID })
  const getStoreInfo = async (storeID) => store.dispatch('geopositioning/getStoreInfo', storeID)

  const handleClickConnect = (storeID) => {
    const url = genAppUrl(storeID)

    window.open(url, '_blank')
  }

  const createMapMarker = (position, map) => {
    const { lat, lng, positionID } = position
    const markerRootElement = document.createElement('div');
    // markerRootElement.textContent = '📍'
    markerRootElement.style.backgroundImage = 'url("/thumbtack.svg")'
    markerRootElement.style.width = '11px'
    markerRootElement.style.height = '20px'

    const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: { lat, lng },
      content: markerRootElement,
    })

    const listener = google.maps.event.addListener(advancedMarker, 'gmp-click', async (event) => {
      const positionStores = await getPositionStores({ positionID })

      stores.value = positionStores

      positionStores.forEach(async ({ storeID }) => {
        const storeInfo = await getStoreInfo(storeID)

        if (storeInfo) {
          const { name, address, city, state, phone, email, tags } = storeInfo

          stores.value = stores.value.map((store) => store.storeID === storeID ? { ...store, ...storeInfo } : store)
        }
      })
    })

    listeners.push(listener)

    return advancedMarker
  }
  const removeAllMapMarker = () => {
    Array.from(advancedMarkers.values()).forEach(advancedMarker => {
      advancedMarker.map = null
      advancedMarker = null
    })
    advancedMarkers.clear()
  }

  const hanedleMapMoved = async () => {
    const center = map.getCenter()
    const data = {
      lat: center.lat(),
      lng: center.lng(),
    }

    cloudConnection?.send({
      action: 'position',
      data,
    })
    setPosstionToSession(data)

    const items = await getLabels(data)

    items.forEach(({ lat, lng, positionID }) => {
      const key = getZone({ lat, lng })

      if (!advancedMarkers.has(key)) advancedMarkers.set(key, createMapMarker({ lat, lng, positionID }, map))
    })
  }

  const hanedlePositionEvent = ({ action, data }) => {
    switch (action) {
      case 'add': {
        const { lat, lng, positionID } = data
        const key = getZone({ lat, lng })

        if (!advancedMarkers.has(key)) advancedMarkers.set(key, createMapMarker({ lat, lng, positionID }, map))
        break
      }

      case 'remove': {
        const { lat, lng } = data
        const key = getZone({ lat, lng })
        const advancedMarker = advancedMarkers.get(key)

        if (advancedMarker) {
          advancedMarker.map = null
          advancedMarkers.delete(key)
        }
        break
      }
    }
  }

  onMounted(async () => {
    const urlPosition = getPosstionFromUrl()
    const sessionPosition = getPosstionFromSession()

    position.value = urlPosition
      ? urlPosition : sessionPosition
      ? sessionPosition
      : await store.dispatch('geolocation/getCurrentPosition')

    const mapElement = document.getElementById('map')

    map = new google.maps.Map(mapElement, {
      streetViewControl: false,
      mapTypeControl: false,
      zoom: 18,
      center: position.value,
      mapId: VITE_GOOGLE_MAPS_MAP_ID,
    })

    map.setOptions({ draggable: false })

    listeners.push(map.addListener('idle', hanedleMapMoved))

    cloudConnection = await connectTunnel(position.value)
    cloudConnection.on('position', hanedlePositionEvent)
  })

  onUnmounted(() => {
    removeAllMapMarker()
    disconnectTunnel()

    listeners.forEach(listener => listener.remove())
    listeners.length = 0
    map = null
  })
</script>

<template>
  <v-container class="h-100">
    <v-row class="ma-0 h-100">
      <v-col cols="12" md="8">
        <div id="map" style="width: 100%; aspect-ratio: 1 / 1;"></div>
      </v-col>
      <v-col cols="12" md="4">
        <template
          v-for="store in stores"
          :key="store.storeID"
        >
          <v-card
            width="100%"
            class="text-start"
            variant="outlined"
          >
            <v-card-title>{{ store.name }}</v-card-title>
            <v-card-subtitle>{{ store.id }}</v-card-subtitle>
            <v-card-text style="white-space: pre-line;">{{ store.description }}</v-card-text>
            <v-card-actions class="d-flex justify-end align-stretch">
              <v-btn class="bg-blue"
                @click="handleClickConnect(store.storeID)"
              >
                {{ $t('Connect') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
