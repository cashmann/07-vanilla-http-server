'use strict';
import Instrument from '../../../src/lib/models/instrument';
const mongoConnect = require('../../../src/util/mongo-connect');
const MONGODB_URI = process.env.MONGODB_URI ||
  'mongodb://localhost/401-2018-instruments';
describe('instrument model', () => {
  beforeAll(() => {
    return mongoConnect(MONGODB_URI);
  });
  it('can save a Instrument', () => {
    let instrument = new Instrument({
      name: 'Test Instrument',
      family: 'Something',
    });
    return instrument.save()
      .then(saved => {
        expect(saved.name).toBe('Test Instrument');
        expect(saved.family).toEqual(instrument.family);
      });
  });
  it('fails if title is missing', () => {
    let instrument = new Instrument({
      created: new Date(),
    });
    return expect(instrument.save())
      .rejects.toBeDefined();
  });
  // TODO: test Instrument.find()
  it('can find an instrument', ()=>{
    console.log(Instrument.find({}));
     
  });
  // TODO: test Instrument.findById()
  // TODO: test Instrument.remove() <= how does this work?
});