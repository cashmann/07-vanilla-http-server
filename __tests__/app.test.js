'use strict';

const request = require('supertest');

const app = require('../src/app');

describe('app', () => {
  it('responds with 404 for unknown path', ()=>{
    return request(app)
      .get('/404')
      .expect(404)
      .expect('Content-Type', 'text/html')
      .expect('Resource Not Found');
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
      .expect('Content-Type', 'application/json')
      .expect(response =>{
        expect(response.body).toBeDefined();
        expect(response.body.content).toMatch(' hi ');
      });
  });
  
  describe('api routes', () => {
    it('can put to /api/v1/notes', ()=>{
      return request(app)
        .put('/api/v1/notes?id=124')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect(response =>{
          expect(response.body).toEqual({'id': '124'});
        });
    });
  });
});
