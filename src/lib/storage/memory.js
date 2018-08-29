'use strict';
const debug = require('debug')('storage/fs');

import uuid from 'uuid/v4';

export default class MemoryStorage {
  constructor(schema) {
    this.schema = schema;
    this.data = {};
  }

  save(document) {
    if (typeof document !== 'object') {
      return Promise.reject(new Error(
        `Failed to save non-object in schema "${this.schema}"`
      ));
    }

    let toSave = {
      id: uuid(),
      ...document,
    };
    this.data[toSave.id] = toSave;
    debug('saved', this);
    return Promise.resolve(toSave);
  }

  get(id) {
    return new Promise((resolve, reject) => {
      var result = this.data[id];
      if (result) {
        resolve({ ...result });
      } else {
        reject(new Error(
          `Document with id "${id}" in schema "${this.schema}" not found`
        ));
      }
    });
  }

  getAll() {
    return Promise.resolve(
      Object.values(this.data).map(entry => ({ ...entry }))
    );
  }
}