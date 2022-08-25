process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testJwt';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('GET /posts/:id', () => {
  let user_id;
  let cookie;
  let post_id;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'testPost1',
      lastName: 'testPost1',
      email: 'testPost1@gmail.com',
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
  it('should return a 200 status code and the post', async () => {
    const response = await request(app)
      .get(`/posts/${post_id}`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(200);
  });
  it('should return a 500 status code on invalid id', async () => {
    const response = await request(app)
      .get(`/posts/123`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});

describe('POST /posts/', () => {
  let user_id;
  let cookie;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'testPost1',
      lastName: 'testPost1',
      email: 'testPost2@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    user_id = body.user;
    cookie = response.header['set-cookie'][0];
  });

  it('should return the success on a successful post creation and a 200 status code', async () => {
    const response = await request(app)
      .post('/posts/')
      .set('cookie', cookie)
      .send({
        id: user_id,
        title: 'post1',
        desc: 'post1',
      });
    const { body } = response;
    expect(body).to.contain.property('success');
    expect(response.statusCode).to.equal(200);
  });

  it('should return a 400 status code on missing field', async () => {
    const response = await request(app)
      .post('/posts/')
      .set('cookie', cookie)
      .send({
        title: 'post1',
        desc: 'post1',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(400);
  });
});

describe('PATCH /posts/:id', () => {
  let user_id;
  let cookie;
  let post_id;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'testPost1',
      lastName: 'testPost1',
      email: 'testPost3@gmail.com',
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
  it('should return a 200 status code on successful update', async () => {
    const response = await request(app)
      .patch(`/posts/${post_id}`)
      .set('cookie', cookie)
      .send({
        id: user_id,
        title: 'post2',
        desc: 'post1',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
  });
  it('should return a 400 status code on invalid id', async () => {
    const response = await request(app)
      .patch(`/posts/123`)
      .set('cookie', cookie)
      .send({
        id: user_id,
        title: 'post2',
        desc: 'post1',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(400);
  });
  it('should return a 400 status code on missing field', async () => {
    const response = await request(app)
      .patch(`/posts/${post_id}`)
      .set('cookie', cookie)
      .send({
        title: 'post1',
        desc: 'post1',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(400);
  });
  it('should return a 400 status code for unauthorized', async () => {
    const response = await request(app)
      .patch(`/posts/${post_id}`)
      .set('cookie', cookie)
      .send({
        id: '123',
        title: 'post2',
        desc: 'post1',
      });
    const { body } = response;
    expect(response.statusCode).to.equal(400);
  });
});

describe('DELETE /posts/:id', () => {
  let user_id;
  let cookie;
  let post_id;
  before(async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'testPost1',
      lastName: 'testPost1',
      email: 'testPost4@gmail.com',
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
  it('should return a 200 status code on successful delete', async () => {
    const response = await request(app)
      .delete(`/posts/${post_id}`)
      .set('cookie', cookie)
      .send({
        id: user_id,
      });
    const { body } = response;
    expect(response.statusCode).to.equal(200);
  });
  it('should return a 500 status code on error', async () => {
    const response = await request(app)
      .delete(`/posts/123`)
      .set('cookie', cookie)
      .send();
    const { body } = response;
    expect(response.statusCode).to.equal(500);
  });
});
