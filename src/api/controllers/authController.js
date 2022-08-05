// Internal Imports
const User = require('../models/User');
const createToken = require('../helpers/helperFunctions');

// Controller Actions

// Signup
module.exports.signup = async (req, res) => {
  try {
    // Checking if user does not exist already
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser)
      return res.status(400).json({ error: 'User with this email exists' });

    // Creating a user
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      followers: [],
      following: [],
    });

    // Creating jwt token
    const token = createToken(user._id);

    // Setting expiry time for jwt
    const maxAgeSec = 1 * 60 * 60; // 1 hour in seconds
    const maxAgeMilliSec = maxAgeSec * 1000; // 1 hour in seconds

    // Sending the response
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAgeMilliSec });
    res.status(201).json({ user: user._id });
  } catch (err) {
    console.log('Error.. ', err);
    res.status(400).json({ err });
  }
};

// Login
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(400).json({ errors });
  }
};

// Logout
module.exports.logout = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
