process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testJwt';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('GET /users/:id', () => {
  let user_id;
  let cookie;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'test1',
      lastName: 'user1',
      email: 'test1@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    user_id = body.user;
    cookie = response.header['set-cookie'][0];
  });

  it('should return the user with the given id', async () => {
    const response = await request(app)
      .get(`/users/${user_id}`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
    expect(body).to.contain.property('_id');
  });

  it('should return 401 status code in case for Unauthorized user', async () => {
    const response = await request(app).get(`/users/${user_id}`).send();
    const { body } = response;
    expect(response.statusCode).to.equal(401);
  });

  it('should return 500 status code for invalid user', async () => {
    const response = await request(app)
      .get(`/users/1234`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});

describe('PATCH /users/:id', () => {
  let user_id;
  let cookie;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'test2',
      lastName: 'user2',
      email: 'test2@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    user_id = body.user;
    cookie = response.header['set-cookie'][0];
  });
  it('should return 200 status code for successful update', async () => {
    const response = await request(app)
      .patch(`/users/${user_id}`)
      .set('cookie', cookie)
      .send({
        firstName: 'updatedFirst',
        lastName: 'updatedLast',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
  });

  it('should return 500 status code for invalid id', async () => {
    const response = await request(app)
      .patch(`/users/1234`)
      .set('cookie', cookie)
      .send({
        firstName: 'updatedFirst',
        lastName: 'updatedLast',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});

describe('DELETE /users/:id', () => {
  let user_id;
  let cookie;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'test3',
      lastName: 'user3',
      email: 'test3@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    user_id = body.user;
    cookie = response.header['set-cookie'][0];
  });
  it('should return 200 status code for successful delete', async () => {
    const response = await request(app)
      .delete(`/users/${user_id}`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
  });

  it('should return 500 status code for invalid id', async () => {
    const response = await request(app)
      .delete(`/users/1234`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});
