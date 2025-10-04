const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Team = require("../models/Team");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role, team } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, role });

    if (role === "manager") {
      if (!team)
        return res
          .status(400)
          .json({ message: "Team name required for manager" });

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

    const token = signToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ user: userResponse });
  } catch (err) {
    next(err);
  }
});

// Login
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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Logged in",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        team: user.team,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get current user
router.get("/me", auth, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.json({ message: "Logged out" });
});

// Get users (admin/manager only)
router.get("/users", auth, async (req, res, next) => {
  try {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const teams = await Team.find()
      .populate("sales_reps", "_id email name role createdAt")
      .populate("manager", "_id name email role");
    res.json({ teams });
  } catch (err) {
    next(err);
  }
});
// Get users (admin/manager only)
router.get("/users/salesreps", auth, async (req, res, next) => {
  try {
    // Only admin or manager can access
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let salesReps = [];

    if (req.user.role === "manager") {
      // Fetch manager's team
      const team = await Team.findById(req.user.team).populate(
        "sales_reps",
        "name email role isActive createdAt"
      );

      if (team) {
        salesReps = team.sales_reps;
      }
    } else if (req.user.role === "admin") {
      // Fetch all teams and collect all sales reps
      const teams = await Team.find().populate(
        "sales_reps",
        "name email role isActive createdAt"
      );

      // Flatten sales reps from all teams
      salesReps = teams.flatMap((team) => team.sales_reps);
    }

    res.json({ salesReps });
  } catch (err) {
    console.error("Error fetching sales reps:", err);
    next(err);
  }
});

module.exports = router;
