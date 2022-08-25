//Internal imports
const User = require('../models/User');

// Dependant External imports
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

module.exports.chargePayment = async (req, res) => {
  try {
    let chargedAmount = 1000;

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 8,
        exp_year: 2023,
        cvc: '314',
      },
    });

    const token = await stripe.tokens.create({
      card: {
        number: '4242424242424242',
        exp_month: 8,
        exp_year: 2023,
        cvc: '314',
      },
    });

    const customer = await stripe.customers.create({
      email: req.body.email,
      // source: token.id,
      id: req.id,
      payment_method: paymentMethod.id,
    });

    const charge = await stripe.charges.create({
      amount: chargedAmount,
      description: 'Social Feed Payment',
      currency: 'USD',
      customer: customer.id,
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.id },
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
