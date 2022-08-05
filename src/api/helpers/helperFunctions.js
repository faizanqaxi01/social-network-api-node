// External Imports
const jwt = require('jsonwebtoken');

// Internal Imports
const config = require('../../config/config');

const createToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret);
};

module.exports = createToken;
