const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the full user object
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    
    req.user = user;
    next();
  } catch(err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};