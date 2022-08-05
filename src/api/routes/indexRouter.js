// External Imports
const express = require('express');
// Internal imports
const indexController = require('../controllers/indexController');
const invalidController = require('../controllers/invalidController');

// Router Object
const indexRouter = express.Router();

// Routing requests to their controllers
indexRouter.get('/', indexController.index_get);
indexRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = indexRouter;
