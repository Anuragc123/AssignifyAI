const JWT = require("jsonwebtoken");
require("dotenv").config(); 

const secret = process.env.JWT_SECRET;


function createTokenForUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
