// External Imports
const express = require('express');

// Internal Imports
const feedController = require('../controllers/feedController');
const invalidController = require('../controllers/invalidController');
const { requireAuth } = require('../middlewares/authMiddleware');

//Setting up router
const feedRouter = express.Router();

// Routing requests to its corresponding controllers
feedRouter.get('/:id', feedController.getFeed);
feedRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = feedRouter;
