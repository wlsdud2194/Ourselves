require('dotenv').config();

const { JWT_SECRET: secret } = process.env;

const jwt = require('jsonwebtoken');

exports.createToken = async (memberId, auth) => { // Create Token
  const payload = {
    memberId, auth,
  };
  const option = { expiresIn: '60 days', subject: 'token' };

  try {
    return await jwt.sign(payload, secret, option);
  } catch (error) {
    throw error;
  }
};

exports.createRefreshToken = async (memberId, auth) => { // Create Refresh Token
  const payload = {
    memberId, auth,
  };
  const option = { expiresIn: '30 days', subject: 'refreshToken' };

  try {
    return await jwt.sign(payload, secret, option);
  } catch (error) {
    throw error;
  }
};

exports.verifyToken = async (token) => { // Verify Token
  try {
    return await jwt.verify(token, secret);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
