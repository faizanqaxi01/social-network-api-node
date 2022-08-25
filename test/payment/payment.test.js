process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testJwt';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('POST /payment/', () => {
  let user_id;
  let cookie;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'testPayment1',
      lastName: 'testPayment1',
      email: 'testPayment1@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    user_id = body.user;
    cookie = response.header['set-cookie'][0];
  });

  it('should return a 400 status code on error', async () => {
    const response = await request(app)
      .post(`/payment/`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(400);
  });
});
