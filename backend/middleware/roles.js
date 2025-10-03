// backend/middleware/roles.js
function checkRole(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const User = require("../models/User");
      const user = await User.findById(req.user.id);

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.userRole = user.role;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = checkRole;
