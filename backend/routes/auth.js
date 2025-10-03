const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, role, team } = req.body;

    // Optional: enforce that only admins can create admin/manager users
    // For now, anyone registering will default to 'sales_rep' if role is not provided
    const user = new User({
      email,
      password,
      name,
      role: role || "sales_rep",
      team: team || null,
    });

    await user.save();

    const token = signToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on prod (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        team: user.team,
      },
    });
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on prod (HTTPS), false on localhost
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      message: "Logged in",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await require("../models/User")
      .findById(payload.id)
      .select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
});
// GET /users?role=sales
router.get("/users", async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(payload.id);
    if (!currentUser) return res.status(401).json({ message: "Unauthorized" });

    // Optional: restrict to admins/managers only
    if (!["admin", "manager"].includes(currentUser.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { role } = req.query; // e.g., role=sales_rep
    const query = { isActive: true };
    if (role) query.role = role;

    const users = await User.find(query).select("-password"); // exclude password
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
