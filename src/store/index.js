import { createStore } from 'vuex'
import auth from './modules/auth'
import cloud from './modules/cloud'
import geolocation from './modules/geolocation'

const store = createStore({
  modules: {
    auth,
    cloud,
    geolocation,
  },
})

export default store
