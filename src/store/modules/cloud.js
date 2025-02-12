import awsconfig from '@/aws-exports'
import CloudConnection from '@/utils/APIGatewayConnection'

const { VITE_AWS_API_GATEWAY_STORE_URL, VITE_AWS_API_GATEWAY_VISITOR_URL } = import.meta.env
const { aws_user_pools_web_client_id: WEB_CLIENT_ID } = awsconfig

export default {
  namespaced: true,
  state: () => ({
    connection: null,
  }),
  mutations: {
    SET_CONNECTION(state, connection) {
      state.connection = connection
    },
  },
  actions: {
    async storeConnect({ commit, dispatch }, { storeId='', lat=0, lng=0, }={}) {
      const genToken = async () => ({
        storeId,
        lat,
        lng,
        clientId: WEB_CLIENT_ID,
        token: await dispatch('auth/getIdToken', null, { root: true }),
      })

      const cloudConnection = new CloudConnection({
        url: VITE_AWS_API_GATEWAY_STORE_URL,
        genToken,
      })

      await cloudConnection.connect()

      commit('SET_CONNECTION', cloudConnection)

      return cloudConnection
    },
    async visitorConnect({ commit }, { storeId='' }={}) {
      const genToken = () => ({
        storeId,
      })

      const cloudConnection = new CloudConnection({
        url: VITE_AWS_API_GATEWAY_VISITOR_URL,
        genToken,
      })

      await cloudConnection.connect()

      commit('SET_CONNECTION', cloudConnection)

      return cloudConnection
    },
    disconnect({ state, commit }) {
      const { connection } = state

      connection?.disconnect()

      commit('SET_CONNECTION', null)
    },
  },
}
