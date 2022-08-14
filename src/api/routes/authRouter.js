// External Imports
const express = require('express');

// Internal Imports
const authController = require('../controllers/authController');
const invalidController = require('../controllers/invalidController');

//Setting up router
const authRouter = express.Router();

// Routing requests to its corresponding controllers
authRouter.post('/', authController.signup);
authRouter.post('/login', authController.login);
authRouter.get('/logout', authController.logout);
authRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = authRouter;
