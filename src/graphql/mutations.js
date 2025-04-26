/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPosition = /* GraphQL */ `
  mutation CreatePosition(
    $input: CreatePositionInput!
    $condition: ModelPositionConditionInput
  ) {
    createPosition(input: $input, condition: $condition) {
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
export const updatePosition = /* GraphQL */ `
  mutation UpdatePosition(
    $input: UpdatePositionInput!
    $condition: ModelPositionConditionInput
  ) {
    updatePosition(input: $input, condition: $condition) {
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
export const deletePosition = /* GraphQL */ `
  mutation DeletePosition(
    $input: DeletePositionInput!
    $condition: ModelPositionConditionInput
  ) {
    deletePosition(input: $input, condition: $condition) {
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
export const createStoreConnection = /* GraphQL */ `
  mutation CreateStoreConnection(
    $input: CreateStoreConnectionInput!
    $condition: ModelStoreConnectionConditionInput
  ) {
    createStoreConnection(input: $input, condition: $condition) {
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
export const updateStoreConnection = /* GraphQL */ `
  mutation UpdateStoreConnection(
    $input: UpdateStoreConnectionInput!
    $condition: ModelStoreConnectionConditionInput
  ) {
    updateStoreConnection(input: $input, condition: $condition) {
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
export const deleteStoreConnection = /* GraphQL */ `
  mutation DeleteStoreConnection(
    $input: DeleteStoreConnectionInput!
    $condition: ModelStoreConnectionConditionInput
  ) {
    deleteStoreConnection(input: $input, condition: $condition) {
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
export const createVisitorConnection = /* GraphQL */ `
  mutation CreateVisitorConnection(
    $input: CreateVisitorConnectionInput!
    $condition: ModelVisitorConnectionConditionInput
  ) {
    createVisitorConnection(input: $input, condition: $condition) {
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
export const updateVisitorConnection = /* GraphQL */ `
  mutation UpdateVisitorConnection(
    $input: UpdateVisitorConnectionInput!
    $condition: ModelVisitorConnectionConditionInput
  ) {
    updateVisitorConnection(input: $input, condition: $condition) {
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
export const deleteVisitorConnection = /* GraphQL */ `
  mutation DeleteVisitorConnection(
    $input: DeleteVisitorConnectionInput!
    $condition: ModelVisitorConnectionConditionInput
  ) {
    deleteVisitorConnection(input: $input, condition: $condition) {
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
export const createStore = /* GraphQL */ `
  mutation CreateStore(
    $input: CreateStoreInput!
    $condition: ModelStoreConditionInput
  ) {
    createStore(input: $input, condition: $condition) {
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
export const updateStore = /* GraphQL */ `
  mutation UpdateStore(
    $input: UpdateStoreInput!
    $condition: ModelStoreConditionInput
  ) {
    updateStore(input: $input, condition: $condition) {
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
export const deleteStore = /* GraphQL */ `
  mutation DeleteStore(
    $input: DeleteStoreInput!
    $condition: ModelStoreConditionInput
  ) {
    deleteStore(input: $input, condition: $condition) {
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
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
export const createBilling = /* GraphQL */ `
  mutation CreateBilling(
    $input: CreateBillingInput!
    $condition: ModelBillingConditionInput
  ) {
    createBilling(input: $input, condition: $condition) {
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
export const updateBilling = /* GraphQL */ `
  mutation UpdateBilling(
    $input: UpdateBillingInput!
    $condition: ModelBillingConditionInput
  ) {
    updateBilling(input: $input, condition: $condition) {
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
export const deleteBilling = /* GraphQL */ `
  mutation DeleteBilling(
    $input: DeleteBillingInput!
    $condition: ModelBillingConditionInput
  ) {
    deleteBilling(input: $input, condition: $condition) {
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
export const createPaymnet = /* GraphQL */ `
  mutation CreatePaymnet(
    $input: CreatePaymnetInput!
    $condition: ModelPaymnetConditionInput
  ) {
    createPaymnet(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePaymnet = /* GraphQL */ `
  mutation UpdatePaymnet(
    $input: UpdatePaymnetInput!
    $condition: ModelPaymnetConditionInput
  ) {
    updatePaymnet(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePaymnet = /* GraphQL */ `
  mutation DeletePaymnet(
    $input: DeletePaymnetInput!
    $condition: ModelPaymnetConditionInput
  ) {
    deletePaymnet(input: $input, condition: $condition) {
      id
      createdAt
      updatedAt
      __typename
    }
  }
`;
