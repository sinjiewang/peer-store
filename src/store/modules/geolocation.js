import coordinate from '@/utils/coordinate'

export default {
  namespaced: true,
  actions: {
    getAddressFromPosition(_, { address='', zip=null }={}) {
      return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder()
        const params = { address }

        if (zip !== null) params.componentRestrictions = { postalCode: zip }

        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK") {
            const { location } = results[0].geometry

            resolve({
              lat: location.lat(),
              lng: location.lng(),
            })
          } else {
            reject(new Error('Incorrect address'))
          }
        })
      })
    },
    async getNavigatorCurrentPosition() {
      return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
        .then(({ coords }) => ({
          accuracy: coords.accuracy,
          ...coordinate.transform({
            lat: coords.latitude,
            lng: coords.longitude,
          }),
        }))
    },
    async getGeolocationAPI() {
      const { VITE_GOOGLE_APIS_GEOLOCATE_URL, VITE_GOOGLE_MAPS_APIKEY } = import.meta.env
      const googleapisUrl = `${VITE_GOOGLE_APIS_GEOLOCATE_URL}?key=${VITE_GOOGLE_MAPS_APIKEY}`

      return fetch(googleapisUrl, {
        method: 'POST',
      }).then(res => res.json())
        .then(({ accuracy, location }) => ({ accuracy, ...coordinate.transform(location)}))
    },
    async getCurrentPosition({ commit, dispatch }) {
      return 'geolocation' in navigator
        ? dispatch('getNavigatorCurrentPosition')
        : dispatch('getGeolocationAPI')
    },
  },
}
