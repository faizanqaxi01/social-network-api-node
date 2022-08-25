process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testJwt';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('PATCH moderator/posts/:id', () => {
  let user_id;
  let cookie;
  let post_id;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'testModeratorPost1',
      lastName: 'testModeratorPost1',
      email: 'testModeratorPost1@gmail.com',
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

  it('should return a 401 status code on invalid id', async () => {
    const response = await request(app)
      .patch(`/moderator/posts/123`)
      .set('cookie', cookie)
      .send({
        id: user_id,
        title: 'post2',
        desc: 'post1',
        isModerator: true,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(401);
  });
  it('should return a 500 status code on missing field', async () => {
    const response = await request(app)
      .patch(`/moderator/posts/${post_id}`)
      .set('cookie', cookie)
      .send({
        title: 'post1',
        desc: 'post1',
        isModerator: true,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
  it('should return a 500 status code for unauthorized', async () => {
    const response = await request(app)
      .patch(`/moderator/posts/${post_id}`)
      .set('cookie', cookie)
      .send({
        id: '123',
        title: 'post2',
        desc: 'post1',
        isModerator: true,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});
