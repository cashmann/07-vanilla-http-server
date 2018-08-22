'use strict';

const request = require('supertest');

const app = require('../src/app');

const cowsay = require('cowsay');

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
  it('responds with JSON for a POST /api/v1/notes', ()=>{
    return request(app)
      .post('/api/v1/notes')
      .send({text: 'hi'})
      .expect(200)
      .expect(response =>{
        expect(response.body).toEqual({"text": "hi"});
      });
  });
  describe('api routes', () => {
    it('can get /api/v1/notes', () => {
      return request(app)
        .get('/api/v1/notes?id=124')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect(response=>{
          expect(response.body).toEqual({ message: `ID 124 was requested` });
        });
    });
    it('can delete /api/v1/notes?id=deleteme', () => {
      return request(app)
        .delete('/api/notes?id=deleteme')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect({ message: `ID deleteme was deleted` });
    });
    it('can put to /api/v1/notes', ()=>{
      return request(app)
        .put('/api/v1/notes?id=124')
        .expect(200)
        .expect('Content-Type', 'application/json')
        .expect(response =>{
          expect(response.body).toEqual({"id": "124"});
        });
    });
  });
});
