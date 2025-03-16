const e = require("express");
const { validateToken } = require("../services/auth");

function checkForAuthCookie(cookie) {
  return (req, res, next) => {
    const token = req.cookies?.tokenId;
    if (!token) {
      return next();
    }
    try {
      const userPayload = validateToken(token);
      req.user = userPayload;
    } catch (error) {
      console.log("Error=", error);
    }
    return next();
  };
}

module.exports = { checkForAuthCookie };
