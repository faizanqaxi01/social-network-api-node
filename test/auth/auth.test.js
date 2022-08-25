process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testJwt';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

describe('POST /auth/', () => {
  it('should return the user on a successful signup and a 201 status code', async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'test',
      lastName: 'user',
      email: 'test@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    expect(body).to.contain.property('user');
    expect(response.statusCode).to.equal(201);
  });
  it('should return error for signing in with same email', async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'test',
      lastName: 'user',
      email: 'test@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    expect(body).to.contain.property('error');
    expect(response.statusCode).to.equal(400);
  });

  it('should return validation error', async () => {
    const response = await request(app).post('/auth/').send({
      firstName: 'test',
      lastName: 'user',
    });
    const { body } = response;
    expect(body).to.contain.property('error');
    expect(response.statusCode).to.equal(400);
  });
});

describe('POST /auth/login', () => {
  it('should return the user on a successful login and a 200 status code', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@gmail.com',
      password: 'testPass',
    });
    const { body } = response;
    expect(body).to.contain.property('user');
    expect(response.statusCode).to.equal(200);
  });
  it('should return validation error', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'test@gmail.com',
    });
    const { body } = response;
    expect(body).to.contain.property('error');
    expect(response.statusCode).to.equal(400);
  });
});

describe('GET /auth/logout', () => {
  it('should return a 200 status code on successful logout', async () => {
    const response = await request(app).get('/auth/logout').send();
    const { body } = response;
    expect(body).to.contain.property('msg');
    expect(response.statusCode).to.equal(200);
  });
});
