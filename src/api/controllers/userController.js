// Internal Imports
const User = require('../models/User');

// Controller Actions

// Get a user - protected route
module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update a user - protected route
module.exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });

    res.status(200).json({ msg: 'Account has been updated' });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

// Delete a user
module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: 'Account has been deleted', user: user });
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

// Follow a user
module.exports.followUser = async (req, res) => {
  try {
    // Get the user to follow
    let toFollow = await User.findOne({ _id: req.params.id });

    // Get the current user
    let user = await User.findOne({ _id: req.body.id });

    // if already following
    if (user.following.includes(req.params.id))
      return res.status(400).json({ error: 'Error: Already following' });

    // update the following of current user - add to following
    user.following.push(toFollow._id);

    // save the current user
    user = await user.save();

    // update the followers of toFollow user - add to followers
    toFollow.followers.push(user._id);

    // save the toFollow user
    toFollow = await toFollow.save();

    // send the success response
    res.status(200).json({
      success: true,
      msg: 'Followed successfully',
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

// Unfollow a user
module.exports.unfollowUser = async (req, res) => {
  try {
    // Get the user to unfollow
    let toUnfollow = await User.findOne({ _id: req.params.id });

    // Get the current user
    let user = await User.findOne({ _id: req.body.id });

    // if not following
    if (!user.following.includes(req.params.id))
      return res.status(400).json({ error: 'Error: Not following' });

    // update the following of current user - Remove from following
    user.following = user.following.filter(
      (item) => item.toString() != toUnfollow._id.toString()
    );

    // save the current user
    user = await user.save();

    // update the followers of toUnfollow user - remove from followers
    toUnfollow.followers = toUnfollow.followers.filter(
      (item) => item.toString() !== user._id.toString()
    );

    // save the toUnfollow user
    toUnfollow = await toUnfollow.save();

    // send the success response
    res.json({
      success: true,
      msg: 'Unfollowed successfully',
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
