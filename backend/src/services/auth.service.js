const User = require('../models/User');
const { signToken } = require('../utils/jwt');

/**
 * Registers a new user.
 * @returns {{ user: object, token: string }}
 */
const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email is already registered.');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id.toString());

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

/**
 * Authenticates a user by email + password.
 * @returns {{ user: object, token: string }}
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken(user._id.toString());

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

module.exports = { register, login };
