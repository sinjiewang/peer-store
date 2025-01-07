import { signOut } from 'aws-amplify/auth'

export default {
  namespaced: true,
  state: {
    user: null, // { userId, email }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    CLEAR_USER(state) {
      state.user = null
    },
  },
  actions: {
    setUser({ commit }, userData=null) {
      return new Promise((resolve) => {
        commit('SET_USER', userData)

        resolve(userData)
      })
    },
    signOut({ commit }, global=false) {
      return new Promise(async (resolve) => {
        await signOut({ global })

        commit('CLEAR_USER')
        resolve()
      })
    },
  },
  getters: {
    user: (state) => state.user,
    isAuthenticated: (state) => state.user !== null,
  },
}
