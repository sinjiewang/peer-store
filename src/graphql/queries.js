/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPosition = /* GraphQL */ `
  query GetPosition($positionID: String!) {
    getPosition(positionID: $positionID) {
      positionID
      lat
      lng
      stores {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPositions = /* GraphQL */ `
  query ListPositions(
    $positionID: String
    $filter: ModelPositionFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPositions(
      positionID: $positionID
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        positionID
        lat
        lng
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStoreConnection = /* GraphQL */ `
  query GetStoreConnection($id: ID!) {
    getStoreConnection(id: $id) {
      id
      connectionID
      store {
        id
        name
        description
        address
        city
        state
        zip
        phone
        email
        image
        tags
        merchantID
        hashKey
        hashIV
        createdAt
        updatedAt
        owner
        __typename
      }
      storeID
      positionID
      position {
        positionID
        lat
        lng
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStoreConnections = /* GraphQL */ `
  query ListStoreConnections(
    $filter: ModelStoreConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStoreConnections(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        connectionID
        storeID
        positionID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getClientConnection = /* GraphQL */ `
  query GetClientConnection($id: ID!) {
    getClientConnection(id: $id) {
      id
      connectionID
      lat
      lng
      zone
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listClientConnections = /* GraphQL */ `
  query ListClientConnections(
    $filter: ModelClientConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClientConnections(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        connectionID
        lat
        lng
        zone
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStore = /* GraphQL */ `
  query GetStore($id: ID!) {
    getStore(id: $id) {
      id
      name
      description
      address
      city
      state
      zip
      phone
      email
      image
      tags
      merchantID
      hashKey
      hashIV
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listStores = /* GraphQL */ `
  query ListStores(
    $filter: ModelStoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStores(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        address
        city
        state
        zip
        phone
        email
        image
        tags
        merchantID
        hashKey
        hashIV
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const positionsByLat = /* GraphQL */ `
  query PositionsByLat(
    $lat: Float!
    $sortDirection: ModelSortDirection
    $filter: ModelPositionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    positionsByLat(
      lat: $lat
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        positionID
        lat
        lng
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const positionsByLng = /* GraphQL */ `
  query PositionsByLng(
    $lng: Float!
    $sortDirection: ModelSortDirection
    $filter: ModelPositionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    positionsByLng(
      lng: $lng
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        positionID
        lat
        lng
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storeConnectionsByConnectionID = /* GraphQL */ `
  query StoreConnectionsByConnectionID(
    $connectionID: String!
    $sortDirection: ModelSortDirection
    $filter: ModelStoreConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storeConnectionsByConnectionID(
      connectionID: $connectionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        connectionID
        storeID
        positionID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storeConnectionsByStoreID = /* GraphQL */ `
  query StoreConnectionsByStoreID(
    $storeID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStoreConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storeConnectionsByStoreID(
      storeID: $storeID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        connectionID
        storeID
        positionID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storeConnectionsByPositionID = /* GraphQL */ `
  query StoreConnectionsByPositionID(
    $positionID: String!
    $sortDirection: ModelSortDirection
    $filter: ModelStoreConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storeConnectionsByPositionID(
      positionID: $positionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        connectionID
        storeID
        positionID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const clientConnectionsByConnectionID = /* GraphQL */ `
  query ClientConnectionsByConnectionID(
    $connectionID: String!
    $sortDirection: ModelSortDirection
    $filter: ModelClientConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    clientConnectionsByConnectionID(
      connectionID: $connectionID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        connectionID
        lat
        lng
        zone
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const clientConnectionsByZone = /* GraphQL */ `
  query ClientConnectionsByZone(
    $zone: String!
    $sortDirection: ModelSortDirection
    $filter: ModelClientConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    clientConnectionsByZone(
      zone: $zone
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        connectionID
        lat
        lng
        zone
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
