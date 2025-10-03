const express = require("express");
const Team = require("../models/Team");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route   POST /teams
 * @desc    Create a new team (Manager only, after login)
 */
router.post("/", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Only managers can create teams" });
    }

    const team = new Team({
      name: req.body.name,
      manager: req.user._id,
      sales_reps: [], // empty initially
    });

    await team.save();
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   GET /teams
 * @desc    Public: List all teams (no auth required)
 */
router.get("/", async (req, res, next) => {
  try {
    const teams = await Team.find().select("name manager");
    res.json(teams);
  } catch (err) {
    next(err);
  }
});

/**
 * @route   PUT /teams/:id/join
 * @desc    Join a team (Sales Rep only)
 */
router.put("/:id/join", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "sales_rep") {
      return res.status(403).json({ message: "Only sales reps can join teams" });
    }

    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!team.sales_reps.includes(req.user._id)) {
      team.sales_reps.push(req.user._id);
      await team.save();
    }

    res.json(team);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
