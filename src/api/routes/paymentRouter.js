// External Imports
const express = require('express');

// Internal Imports
const paymentController = require('../controllers/paymentController');
const invalidController = require('../controllers/invalidController');
const { requireAuth, checkUser } = require('../middlewares/authMiddleware');

//Setting up router
const paymentRouter = express.Router();

// Routing requests to its corresponding controllers
paymentRouter.post('/', requireAuth, paymentController.chargePayment);
paymentRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = paymentRouter;
