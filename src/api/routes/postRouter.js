// External Imports
const express = require('express');

// Internal Imports
const postController = require('../controllers/postController');
const invalidController = require('../controllers/invalidController');

//Setting up router
const postRouter = express.Router();

// Routing requests to its corresponding controllers
postRouter.get('/:id', postController.getPost);
postRouter.post('/', postController.createPost);
postRouter.patch('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);
postRouter.all('/', invalidController.badRequest); // Any invalid operation on this route

// Exporting the module
module.exports = postRouter;
