process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testJwt';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('POST /follow/:id', () => {
  let user_id;
  let cookie;
  let toFollow_id;
  before(async () => {
    const response1 = await request(app).post('/auth/').send({
      firstName: 'test-follow1',
      lastName: 'test-follow1',
      email: 'test-follow1@gmail.com',
      password: 'testPass',
    });
    user_id = response1.body.user;
    cookie = response1.header['set-cookie'][0];

    const response2 = await request(app).post('/auth/').send({
      firstName: 'test-follow2',
      lastName: 'test-follow2',
      email: 'test-follow2@gmail.com',
      password: 'testPass',
    });

    toFollow_id = response2.body.user;
  });

  it('should return 200 status for successful follow', async () => {
    const response = await request(app)
      .post(`/follow/${toFollow_id}`)
      .set('cookie', cookie)
      .send({
        id: user_id,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('success');
  });

  it('should return 400 status for already following', async () => {
    const response = await request(app)
      .post(`/follow/${toFollow_id}`)
      .set('cookie', cookie)
      .send({
        id: user_id,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(400);
    expect(body).to.contain.property('error');
  });

  it('should return 500 status for invalid id', async () => {
    const response = await request(app)
      .post(`/follow/123`)
      .set('cookie', cookie)
      .send({
        id: user_id,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});

describe('DELETE /follow/:id', () => {
  let user_id;
  let cookie;
  let toUnfollow_id;
  before(async () => {
    const response1 = await request(app).post('/auth/').send({
      firstName: 'test-unfollow1',
      lastName: 'test-unfollow1',
      email: 'test-unfollow1@gmail.com',
      password: 'testPass',
    });
    user_id = response1.body.user;
    cookie = response1.header['set-cookie'][0];

    const response2 = await request(app).post('/auth/').send({
      firstName: 'test-unfollow2',
      lastName: 'test-unfollow2',
      email: 'test-unfollow2@gmail.com',
      password: 'testPass',
    });
    toUnfollow_id = response2.body.user;

    const response = await request(app)
      .post(`/follow/${toUnfollow_id}`)
      .set('cookie', cookie)
      .send({
        id: user_id,
      });
  });

  it('should return 200 status for successful unfollow', async () => {
    const response = await request(app)
      .delete(`/follow/${toUnfollow_id}`)
      .set('cookie', cookie)
      .send({
        id: user_id,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('success');
  });

  it('should return 400 status for not following', async () => {
    const response = await request(app)
      .delete(`/follow/${toUnfollow_id}`)
      .set('cookie', cookie)
      .send({
        id: user_id,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(400);
    expect(body).to.contain.property('error');
  });

  it('should return 500 status for invalid id', async () => {
    const response = await request(app)
      .delete(`/follow/123`)
      .set('cookie', cookie)
      .send({
        id: user_id,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});
