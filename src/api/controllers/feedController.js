// Internal Imports
const User = require('../models/User');
const Post = require('../models/Post');

// Get feed
module.exports.getFeed = async (req, res) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 3;

    const user = await User.findById(req.params.id);

    // If the user is not paid, do not show the feed
    // if (user.type === 'unpaid')
    //   return res
    //     .status(400)
    //     .json({ error: 'Error: Only paid users can access the feed' });

    const total = await Post.find({
      userId: { $in: user.following },
    }).countDocuments();

    let posts = await Post.find({ userId: { $in: user.following } })
      .populate('userId', ['name'])
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      posts: posts,
      total: total,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
