/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStore = /* GraphQL */ `
  subscription OnCreateStore(
    $filter: ModelSubscriptionStoreFilterInput
    $owner: String
  ) {
    onCreateStore(filter: $filter, owner: $owner) {
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
export const onUpdateStore = /* GraphQL */ `
  subscription OnUpdateStore(
    $filter: ModelSubscriptionStoreFilterInput
    $owner: String
  ) {
    onUpdateStore(filter: $filter, owner: $owner) {
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
export const onDeleteStore = /* GraphQL */ `
  subscription OnDeleteStore(
    $filter: ModelSubscriptionStoreFilterInput
    $owner: String
  ) {
    onDeleteStore(filter: $filter, owner: $owner) {
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
export const onCreatePosition = /* GraphQL */ `
  subscription OnCreatePosition($filter: ModelSubscriptionPositionFilterInput) {
    onCreatePosition(filter: $filter) {
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
export const onUpdatePosition = /* GraphQL */ `
  subscription OnUpdatePosition($filter: ModelSubscriptionPositionFilterInput) {
    onUpdatePosition(filter: $filter) {
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
export const onDeletePosition = /* GraphQL */ `
  subscription OnDeletePosition($filter: ModelSubscriptionPositionFilterInput) {
    onDeletePosition(filter: $filter) {
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
export const onCreateStoreConnection = /* GraphQL */ `
  subscription OnCreateStoreConnection(
    $filter: ModelSubscriptionStoreConnectionFilterInput
  ) {
    onCreateStoreConnection(filter: $filter) {
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
export const onUpdateStoreConnection = /* GraphQL */ `
  subscription OnUpdateStoreConnection(
    $filter: ModelSubscriptionStoreConnectionFilterInput
  ) {
    onUpdateStoreConnection(filter: $filter) {
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
export const onDeleteStoreConnection = /* GraphQL */ `
  subscription OnDeleteStoreConnection(
    $filter: ModelSubscriptionStoreConnectionFilterInput
  ) {
    onDeleteStoreConnection(filter: $filter) {
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
export const onCreateVisitorConnection = /* GraphQL */ `
  subscription OnCreateVisitorConnection(
    $filter: ModelSubscriptionVisitorConnectionFilterInput
  ) {
    onCreateVisitorConnection(filter: $filter) {
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
export const onUpdateVisitorConnection = /* GraphQL */ `
  subscription OnUpdateVisitorConnection(
    $filter: ModelSubscriptionVisitorConnectionFilterInput
  ) {
    onUpdateVisitorConnection(filter: $filter) {
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
export const onDeleteVisitorConnection = /* GraphQL */ `
  subscription OnDeleteVisitorConnection(
    $filter: ModelSubscriptionVisitorConnectionFilterInput
  ) {
    onDeleteVisitorConnection(filter: $filter) {
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
