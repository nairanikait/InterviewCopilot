const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Signs a JWT containing the user's id.
 * @param {string} userId
 * @returns {string} signed token
 */
const signToken = (userId) => {
  if (!SECRET) throw new Error('JWT_SECRET is not configured.');
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: EXPIRES_IN });
};

/**
 * Verifies and decodes a JWT.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  if (!SECRET) throw new Error('JWT_SECRET is not configured.');
  return jwt.verify(token, SECRET);
};

module.exports = { signToken, verifyToken };
