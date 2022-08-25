// External Imports
const express = require('express');

// Internal Imports
const userController = require('../controllers/userController');
const invalidController = require('../controllers/invalidController');

//Setting up router
const followRouter = express.Router();

// Routing requests to its corresponding controllers
followRouter.post('/:id', userController.followUser);
followRouter.delete('/:id', userController.unfollowUser);
followRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = followRouter;
