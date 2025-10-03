// middleware/softAuth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function softAuth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return next(); // just continue without user

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (err) {
    // ignore error, continue without user
  }
  next();
};

module.exports = softAuth;
