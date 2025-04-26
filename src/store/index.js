import { createStore } from 'vuex'
import auth from './modules/auth'
import cloud from './modules/cloud'
import geolocation from './modules/geolocation'
import geopositioning from './modules/geopositioning'

const store = createStore({
  modules: {
    auth,
    cloud,
    geolocation,
    geopositioning,
  },
})

export default store
