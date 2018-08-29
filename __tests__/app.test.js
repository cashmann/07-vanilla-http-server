'use strict';

const request = require('supertest');

import app from '../src/app';
import Instrument from '../src/lib/models/instrument';

describe('app', () => {
  it('responds with 404 for unknown path', ()=>{
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html; charset=utf-8');
  });

  it('responds with HTML for /', ()=>{
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response =>{
        expect(response.text[0]).toBe('<');
      });
  });

  it('responds with HTML for /cowsay?text={message}', ()=>{
    return request(app)
      .get('/cowsay?text=hi')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect(response =>{
        expect(response.text).toBeDefined();
        expect(response.text).toMatch('<html>');
        expect(response.text).toMatch(' hi ');
        expect(response.text).toMatch('</html>');
      });
  });

  it('responds with JSON for /api/cowsay?text={message}', ()=>{
    return request(app)
      .get('/api/cowsay?text=hi')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(response =>{
        expect(response.body).toBeDefined();
        expect(response.body.content).toMatch(' hi ');
      });
  });
  
  describe('api routes', () => {
    it('can PUT to /api/v1/instruments', ()=>{
      var instrument = new Instrument({ name: 'Trumpet', class: 'Brass', retailer: 'Reimans' });

      return instrument.save()
        .then(saved => {
          return request(app)
            .put(`/api/v1/instruments/${saved.id}`)
            .send({ name: 'Trumpet', class: 'Brass', retailer: 'West Music'})
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(saved);
        });
    });
    it('can POST /api/v1/instruments to create instrument', () => {
      return request(app)
        .post('/api/v1/instruments')
        .send({ name: 'Trumpet', class: 'Brass', retailer: 'Reimans' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(response => {
          expect(response.body).toBeDefined();
          expect(response.body.id).toBeDefined();
          expect(response.body.name).toBe('Trumpet');
          expect(response.body.class).toBe('Brass');
        });
    });
    it('can get /api/v1/instruments/:id', () => {
      var instrument = new Instrument({ name: 'Trumpet', class: 'Brass', retailer: 'Reimans' });

      return instrument.save()
        .then(saved => {
          return request(app)
            .get(`/api/v1/instruments/${saved.id}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(saved);
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
