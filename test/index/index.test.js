process.env.NODE_ENV = 'test';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

describe('GET /', () => {
  it('should return 200 status code for GET on / route', async () => {
    const response = await request(app).get('/').send();
    expect(response.statusCode).to.equal(200);
  });
});

describe('POST /', () => {
  it('should return 400 status code for POST / route', async () => {
    const response = await request(app).post('/').send();
    expect(response.statusCode).to.equal(400);
  });
});
