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
  describe('find by ID', ()=>{
    let testInstrument;
    beforeAll(()=>{
      testInstrument = new Instrument({
        name: 'Test',
        family: 'Test',
        retailer: null,
      });
      return testInstrument.save();
    });
    it('can find an instrument by its ID', ()=>{
      return Instrument.findById(testInstrument._id)
        .then(instrument=>{
          expect(instrument).toBeDefined();
          expect(instrument.name).toBe('Test');
          expect(instrument._id).toEqual(testInstrument._id);
        });
    });
  });
  // TODO: test Instrument.findById()
  // TODO: test Instrument.remove() <= how does this work?
});