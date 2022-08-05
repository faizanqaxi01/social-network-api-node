// Internal Imports
const Post = require('../models/Post');

// Get a post
module.exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Create a post - protected
module.exports.createPost = async (req, res) => {
  try {
    if (!(req.body.id && req.body.title && req.body.desc)) {
      return res.status(400).send('Error: Missing Field');
    }
    const newPost = await Post.create({
      userId: req.body.id,
      title: req.body.title,
      description: req.body.description,
    });

    io.getIO().emit('postCreate', { message: 'Post created', newPost });

    res.status(200).json({ success: true, newPost });
  } catch (error) {
    console.log('Error.. ', err);
    res.status(400).json({ err });
  }
};

// Update a post - protected route
module.exports.updatePost = async (req, res) => {
  try {
    if (!(req.body.userId && req.body.title && req.body.desc)) {
      return res.status(400).send('Error: Missing Field');
    }
    const updatedPost = await Post.findByIdAndUpdate({
      $set: req.body,
    });
    io.getIO().emit('postUpdate', { message: 'Post updated', updatedPost });
    res.status(200).json('Post has been updated');
  } catch (err) {
    console.log('Error.. ', err);
    res.status(400).json({ err });
  }
};

// Delete a post - protected route
module.exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!(req.body.id === post.userId || req.body.isAdmin)) {
      return res.status(400).send('Error: You can only delete your own posts');
    }
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    io.getIO().emit('postDelete', { message: 'Post deleted', deletedPost });
    res.status(200).json('Post has been deleted');
  } catch (err) {
    return res.status(500).json(err);
  }
};
