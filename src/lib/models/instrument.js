'use strict';

import Storage from '../storage';
const instrumentStore = new Storage('Instruments');

export default class Instrument {
  constructor(obj) {
    if (!obj) throw new Error('obj is required!');

    this.name = obj.name;
    this.class = obj.class;
    this.retailer = obj.retailer;
  }

  save() {
    return instrumentStore.save(this);
  }

  static fetchAll() {
    return instrumentStore.getAll();
  }

  static findById(id) {
    return instrumentStore.get(id);
  }
}