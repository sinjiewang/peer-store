const { v4: uuidv4 } = require('uuid');
const ddbOperate = require('./ddbOperate')
// import { v4 as uuidv4 } from 'uuid';
// import { ddbQuery, ddbPut, ddbUpdate, ddbDelete } from './ddbOperate.mjs';

module.exports = class DdbActions {
  static TABLE = '';

  static getTypename() {
    return this.TABLE.split('-').shift();
  }

  static async query({ region, condition }={}, options={}) {
    const { TABLE } = this;
    const expressions = [];
    const names = {};
    const values = {};

    Object.entries(condition).forEach(([key, value], index) => {
      const keyIndex = `#key${index}`;
      const valueIndex = `:val${index}`;
      expressions.push(`${keyIndex} = ${valueIndex}`);
      names[keyIndex] = key;
      values[valueIndex] = value;
    });

    const queryData = {
      TableName : `${TABLE}`,
      KeyConditionExpression: expressions.join(' and '),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ...options,
    };

    return ddbOperate.ddbQuery(region, queryData);
  }

  static async create({ region, data }={}, options={}) {
    const { TABLE } = this;
    const typename = this.getTypename();

    const now = new Date().toISOString();
    const itemId = uuidv4();
    const putData = {
      TableName : `${TABLE}`,
      Item: {
        'createdAt': now,
        'updatedAt': now,
        'id': itemId,
        '__typename': typename,
        ...data,
      },
      ...options,
    };

    return ddbOperate.ddbPut(region, putData).then(() => putData.Item);
  }

  static async update({ region, condition, data }={}) {
    const { TABLE } = this;
    const expressions = [];
    const names = {};
    const values = {};

    data.updatedAt = new Date().toISOString();

    Object.entries(data).forEach(([key, value], index) => {
      const keyIndex = `#key${index}`;
      const valueIndex = `:val${index}`;
      expressions.push(`${keyIndex} = ${valueIndex}`);
      names[keyIndex] = key;
      values[valueIndex] = value;
    });

    const updateData = {
      TableName : `${TABLE}`,
      Key: condition,
      UpdateExpression: `set ${ expressions.join(', ') }`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    };

    return ddbOperate.ddbUpdate(region, updateData);
  }

  static async delete({ region, condition }={}) {
    const { TABLE } = this;
    const deleteData = {
      TableName : `${TABLE}`,
      Key: condition,
    };

    return ddbOperate.ddbDelete(region, deleteData);
  }
};
