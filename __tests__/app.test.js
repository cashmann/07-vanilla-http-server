'use strict';

const request = require('supertest');

import app from '../src/app';
import Instrument from '../src/lib/models/instrument';

const mongoConnect = require('../src/util/mongo-connect');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/401-2018-instruments';

describe('app', () => {
  beforeAll(()=>{
    return mongoConnect(MONGODB_URI);
  });

  it('responds with 404 for unknown path', ()=>{
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });
  
  describe('api routes', () => {
    it('can PUT to /api/v1/instruments', ()=>{
      var instrument = new Instrument({ name: 'Trumpet', family: 'Brass', retailer: 'Reimans' });

      return instrument.save()
        .then(saved => {
          return request(app)
            .put(`/api/v1/instruments/${saved._id}`)
            .send({ name: saved.name, class: saved.class, retailer: 'West Music'})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(({ body }) => {
              expect(body).toBeDefined();
              expect(body.name).toBe(saved.name);
              expect(body.class).toBe(saved.class);
              expect(body.retailer).toBe('West Music');
            });
        });
    });
    it('can POST /api/v1/instruments to create instrument', () => {
      return request(app)
        .post('/api/v1/instruments')
        .send({ name: 'Trumpet', family: 'Brass', retailer: 'Reimans' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(response => {
          expect(response.body).toBeDefined();
          expect(response.body._id).toBeDefined();
          expect(response.body.name).toBe('Trumpet');
          expect(response.body.family).toBe('Brass');
        });
    });
    it('can get /api/v1/instruments/:id', () => {
      var instrument = new Instrument({ name: 'Trumpet', family: 'Brass', retailer: 'Reimans' });

      return instrument.save()
        .then(saved => {
          return request(app)
            .get(`/api/v1/instruments/${saved._id}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(response=>{
              expect(response.body).toBeDefined();
              expect(response.body._id).toBeDefined();
              expect(response.body.name).toBe('Trumpet');
            });
        });
    });
    it('can delete /api/notes/deleteme', () => {
      return request(app)
        .delete('/api/v1/instruments/deleteme')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect({ message: `ID deleteme was deleted` });
    });
  });
});
