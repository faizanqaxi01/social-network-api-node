process.env.NODE_ENV = 'test';

const app = require('../../src/app');
const { expect } = require('chai');
const request = require('supertest');

describe('GET /invalid', () => {
  it('should return 404 status code for invalid route', async () => {
    const response = await request(app).get('/invalid').send();
    expect(response.statusCode).to.equal(404);
  });
});
