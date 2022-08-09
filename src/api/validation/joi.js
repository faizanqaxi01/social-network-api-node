const Joi = require('joi');

const signUpSchema = Joi.object({
  firstName: Joi.string().min(1).max(50),
  lastName: Joi.string().min(1).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(5).max(30),
});

const loginSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(5).max(30),
});

const validateSignUp = (signUpObject) => signUpSchema.validate(signUpObject);

const validateLogin = (loginObject) => loginSchema.validate(loginObject);

module.exports = {
  validateSignUp,
  validateLogin,
};
