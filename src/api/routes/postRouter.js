// External Imports
const express = require('express');

// Internal Imports
const postController = require('../controllers/postController');
const invalidController = require('../controllers/invalidController');
const { requireAuth, checkUser } = require('../middlewares/authMiddleware');

//Setting up router
const postRouter = express.Router();

// Routing requests to its corresponding controllers
postRouter.get('/:id', postController.getPost);
postRouter.post('/', requireAuth, postController.createPost);
postRouter.patch('/:id', requireAuth, postController.updatePost);
postRouter.delete('/:id', requireAuth, postController.deletePost);
postRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = postRouter;
