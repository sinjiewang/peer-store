/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOrderByID = /* GraphQL */ `
  query GetOrderByID($id: ID!) {
    getOrderByID(id: $id) {
      id
      storeID
      totalAmount
      detail
      status
      expired
      billingID
      paymentID
      createdAt
      updatedAt
      owner
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
export const getVisitorConnection = /* GraphQL */ `
  query GetVisitorConnection($id: ID!) {
    getVisitorConnection(id: $id) {
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
export const listVisitorConnections = /* GraphQL */ `
  query ListVisitorConnections(
    $filter: ModelVisitorConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVisitorConnections(
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
export const visitorConnectionsByConnectionID = /* GraphQL */ `
  query VisitorConnectionsByConnectionID(
    $connectionID: String!
    $sortDirection: ModelSortDirection
    $filter: ModelVisitorConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    visitorConnectionsByConnectionID(
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
export const visitorConnectionsByZone = /* GraphQL */ `
  query VisitorConnectionsByZone(
    $zone: String!
    $sortDirection: ModelSortDirection
    $filter: ModelVisitorConnectionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    visitorConnectionsByZone(
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
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      storeID
      totalAmount
      detail
      status
      expired
      billingID
      paymentID
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        storeID
        totalAmount
        detail
        status
        expired
        billingID
        paymentID
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
export const getBilling = /* GraphQL */ `
  query GetBilling($id: ID!) {
    getBilling(id: $id) {
      id
      tradeNo
      orderID
      order {
        id
        storeID
        totalAmount
        detail
        status
        expired
        billingID
        paymentID
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listBillings = /* GraphQL */ `
  query ListBillings(
    $filter: ModelBillingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBillings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tradeNo
        orderID
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
export const billingsByTradeNo = /* GraphQL */ `
  query BillingsByTradeNo(
    $tradeNo: String!
    $sortDirection: ModelSortDirection
    $filter: ModelBillingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    billingsByTradeNo(
      tradeNo: $tradeNo
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        tradeNo
        orderID
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
export const getPaymnet = /* GraphQL */ `
  query GetPaymnet($id: ID!) {
    getPaymnet(id: $id) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPaymnets = /* GraphQL */ `
  query ListPaymnets(
    $filter: ModelPaymnetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymnets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
