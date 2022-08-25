// External imports
const jwt = require('jsonwebtoken');

// Internal Imports
const User = require('../models/User');

// Checking if jwt token exists and is verified
const requireAuth = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
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
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
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

const checkModerator = (req, res, next) => {
  User.findById(req.body.id)
    .then((user) => {
      if (!user.isModerator) {
        return res.status(401).json({ err: 'Error: Not a moderator' });
      }
      next();
    })
    .catch((error) => res.status(500).json(error));
};

module.exports = { requireAuth, checkUser, checkModerator };
