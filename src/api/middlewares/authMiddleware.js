// External imports
const jwt = require('jsonwebtoken');

// Internal Imports
const User = require('../models/User');
const config = require('../../../config/config');

// Checking if jwt token exists and is verified
const requireAuth = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    jwt.verify(token, config.jwtSecret, (err, decodedToken) => {
      if (err) {
        res.status(401);
        res.send('Status: 401, Unauthorized client');
      } else {
        next();
      }
    });
  } else {
    console.log('No jwt token');
    res.status(401);
    res.send('Status: 401, Unauthorized client');
  }
};

// Checking current user
const checkUser = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(token, config.jwtSecret, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.status(401);
        res.send('Status: 401, Unauthorized client');
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    console.log('No jwt token');
    res.status(401);
    res.send('Status: 401, Unauthorized client');
  }
};

module.exports = { requireAuth, checkUser };
