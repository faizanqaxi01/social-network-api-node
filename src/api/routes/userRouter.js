// External Imports
const express = require('express');

// Internal Imports
const userController = require('../controllers/userController');
const invalidController = require('../controllers/invalidController');

//Setting up router
const userRouter = express.Router();

// Routing requests to its corresponding controllers
userRouter.get('/:id', userController.getUser);
userRouter.patch('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);
userRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = userRouter;
