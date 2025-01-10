import { signOut, fetchAuthSession } from 'aws-amplify/auth'

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
    async getIdToken() {
      try {
        const currentSession = await fetchAuthSession()
        const idToken = currentSession.tokens?.idToken?.toString()

        return idToken
      } catch (error) {
        console.error('Error fetching ID Token:', error)

        throw error
      }
    }
  },
  getters: {
    user: (state) => state.user,
    isAuthenticated: (state) => state.user !== null,
  },
}
