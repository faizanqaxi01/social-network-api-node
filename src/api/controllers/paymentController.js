//Internal imports
const config = require('../../../config/config');
const User = require('../models/User');

// Dependant External imports
const stripe = require('stripe')(`${config.STRIPE_SECRET_KEY}`);

module.exports.chargePayment = async (req, res) => {
  try {
    let chargedAmount = 1000;

    const customer = await stripe.customers.create({
      email: req.body.email,
      source: req.body.stripeToken,
      id: req.userId,
    });

    const charge = await stripe.charges.create({
      amount: chargedAmount,
      description: 'Social Feed Payment',
      currency: 'USD',
      customer: customer.id,
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.userId },
      { $set: { type: 'paid' } }
    );

    res.status(200).json({
      success: true,
      message: 'Successfully Paid !! ',
      amount: charge,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
