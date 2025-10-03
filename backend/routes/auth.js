const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Team = require("../models/Team");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth"); // make sure you have this

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role, team } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, role });

    if (role === "manager") {
      if (!team)
        return res
          .status(400)
          .json({ message: "Team name required for manager" });

      // Check if a team with this name already exists
      const existingTeam = await Team.findOne({ name: team });
      if (existingTeam) {
        return res.status(400).json({ message: "Team name already exists" });
      }
      const newTeam = new Team({
        name: team,
        manager: user._id,
        sales_reps: [],
      });

      await newTeam.save();
      user.team = newTeam._id;
    }

    if (role === "sales_rep") {
      if (!team)
        return res.status(400).json({ message: "Team required for sales rep" });

      const existingTeam = await Team.findById(team);
      if (!existingTeam)
        return res.status(400).json({ message: "Invalid team selected" });

      user.team = existingTeam._id;
      existingTeam.sales_reps.push(user._id);
      await existingTeam.save();
    }

    await user.save();

    // Sign token and set cookie immediately
    const token = signToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });
    res.status(201).json({ user });
  } catch (err) {
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
