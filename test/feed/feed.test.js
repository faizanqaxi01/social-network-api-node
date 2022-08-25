process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testJwt';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('GET /feed/:id', () => {
  let user_id;
  let cookie;
  let post_id;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'testFeed1',
      lastName: 'testFeed1',
      email: 'testFeed1@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    user_id = body.user;
    cookie = response.header['set-cookie'][0];

    const post_response = await request(app)
      .post('/posts/')
      .set('cookie', cookie)
      .send({
        id: user_id,
        title: 'post1',
        desc: 'post1',
      });
    post_id = post_response.body.newPost._id;
  });
  it('should return a 200 status code on successful feed fetch', async () => {
    const response = await request(app)
      .get(`/feed/${user_id}`)
      .set('cookie', cookie)
      .send({ id: user_id });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
  });
  it('should return a 500 status code on error', async () => {
    const response = await request(app)
      .get(`/feed/123`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});
