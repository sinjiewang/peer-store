import { generateClient } from 'aws-amplify/api';
import { listPositions, getPosition, listStoreConnections, getStoreByID } from '@/graphql/queries';
import coordinate from '@/utils/coordinate';

const QUERY_RANGE = 0.01;
const client = generateClient({
  authMode: 'apiKey'
});

export default {
  namespaced: true,
  state: () => ({
    labels: [],
    userPosition: null,
  }),
  getters: {
    labels(state) {
      return state.labels;
    },
  },
  actions: {
    async getLabels({ commit }, { lat, lng }) {
      const delta = QUERY_RANGE;
      const filter = {
        lat: {
          between: [
            Number((lat - delta).toFixed(6)),
            Number((lat + delta).toFixed(6))
          ],
        },
        lng: {
          between: [
            Number((lng - delta).toFixed(6)),
            Number((lng + delta).toFixed(6))
          ],
        },
      };

      try {
        const items = await client.graphql({
          query: listPositions,
          variables: {
            filter
          }
        }).then(res => res.data.listPositions.items);

        commit('updateLabels', items);

        return items;
      } catch (err) {
        console.error('listPositions fail', err)
      }
    },
    async getPositionStores(_, { positionID, nextToken=null }) {
      try {
        const sites = await client.graphql({
          query: getPosition,
          variables: { positionID, nextToken },
        }).then(res => res.data.getPosition.stores.items);

        return sites;
      } catch (err) {
        console.error('listPositions fail', err)
      }
    },
    async getStoreInfo(_, storeID) {
      try {
        const store = await generateClient().graphql({
          query: getStoreByID,
          variables: { id: storeID },
        }).then(res => res.data.getStoreByID);

        return store;
      } catch (err) {
        console.error('listPositions fail', err)
      }
    },
  },
  mutations: {
    updateLabels(state, labels) {
      state.labels = labels;
    },
    updateUserPosition(state, { lag, lng }) {
      state.userPosition = { lag, lng };
    },
    addLabel(state, position) {
      const hasIncludes = state.labels.find(({ positionId }) => positionId === position.positionId);

      if (!hasIncludes) {
        state.labels = [...state.labels, position];
      }
    },
    removeLabel(state, position) {
      const hasIncludes = state.labels.find(({ positionId }) => positionId === position.positionId);

      if (hasIncludes) {
        state.labels = state.labels.filter(({ positionId }) => positionId !== position.positionId);
      }
    },
  },
}
