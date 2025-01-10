<script setup>
  import { ref, toRefs, onMounted, onUnmounted } from 'vue'

  const props = defineProps({
    store: {
      type: Object,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
    connecting: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(['connect', 'disconnect'])

  const { VITE_GOOGLE_MAPS_MAP_ID } = import.meta.env

  const geocoder = new google.maps.Geocoder()
  const { store, position } = toRefs(props)
  const map = ref(null)

  let advancedMarker;

  onMounted(async () => {
    const { address, zip } = store.value
    const mapElement = document.getElementById('map')
    const map = new google.maps.Map(mapElement, {
      streetViewControl: false,
      mapTypeControl: false,
      zoom: 18,
      center: position.value,
      mapId: VITE_GOOGLE_MAPS_MAP_ID,
    })

    map.setOptions({ draggable: false })

    const markerRootElement = document.createElement("div");
    // markerRootElement.textContent = "📍";
    markerRootElement.style.backgroundImage = "url('/thumbtack.svg')"
    markerRootElement.style.width = "11px";
    markerRootElement.style.height = "20px";

    advancedMarker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: position.value,
      content: markerRootElement,
    });
  })

  onUnmounted(() => {
    if (advancedMarker) {
      advancedMarker.map = null
      advancedMarker = null
    }
  })
</script>

<template>
  <v-row v-if="store">
    <v-col cols="12">
      <div id="map" style="width: 100%; height: 400px;"></div>
    </v-col>
    <v-col cols="12" md="4">
      <v-btn
        v-if="!store.state"
        @click="emit('connect')"
        :disabled="connecting"
        color="green"
        block
      >
        <template slot:prepend v-if="connecting">
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
        @click="emit('disconnect')"
        color="red"
        block
      >{{ $t('Disconnect') }}</v-btn>
    </v-col>
  </v-row>
</template>
