// External Imports
const express = require('express');

// Internal Imports
const postController = require('../controllers/postController');
const invalidController = require('../controllers/invalidController');
const {
  requireAuth,
  checkUser,
  checkModerator,
} = require('../middlewares/authMiddleware');

//Setting up router
const moderatorRouter = express.Router();

// Routing requests to its corresponding controllers
moderatorRouter.patch(
  '/posts/:id',
  requireAuth,
  checkModerator,
  postController.updatePost
);
moderatorRouter.delete(
  '/posts/:id',
  requireAuth,
  checkModerator,
  postController.deletePost
);
moderatorRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = moderatorRouter;
