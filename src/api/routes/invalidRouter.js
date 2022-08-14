// External Imports
const express = require('express');
// Internal imports
const invalidController = require('../controllers/invalidController');

// Router Object
const invalidRouter = express.Router();

// Routing requests to their controllers
invalidRouter.all('/', invalidController.invalidURL); // Any invalid operation on this route

// Exporting the module
module.exports = invalidRouter;
