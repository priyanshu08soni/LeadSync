// backend/routes/analytics.js
const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const Activity = require("../models/Activity");
const User = require("../models/User");
const Team = require("../models/Team");
const auth = require("../middleware/auth");

// Overview stats
router.get("/overview", auth, async (req, res, next) => {
  try {
    const { startDate, endDate, managerId, userId } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const leadFilter = {};
    if (Object.keys(dateFilter).length > 0) {
      leadFilter.createdAt = dateFilter;
    }

    // Apply role-based filtering
    if (req.user.role === "admin") {
      // Admin with filters
      if (userId) {
        leadFilter.assigned_to = userId;
      } else if (managerId) {
        // Get team members for this manager
        const team = await Team.findOne({ manager: managerId });
        if (team) {
          leadFilter.assigned_to = { $in: [...team.sales_reps, team.manager] };
        }
      }
      // If no filters, show all data
    } else if (req.user.role === "manager") {
      // Manager can see their own team
      const team = await Team.findOne({ manager: req.user._id });
      if (team) {
        leadFilter.assigned_to = { $in: [...team.sales_reps, req.user._id] };
      } else {
        leadFilter.assigned_to = req.user._id;
      }
    } else {
      // Sales rep can only see their own data
      leadFilter.assigned_to = req.user._id;
    }

    // Get user IDs for activity filter
    let activityUserFilter = {};
    if (leadFilter.assigned_to) {
      if (leadFilter.assigned_to.$in) {
        activityUserFilter = { user_id: { $in: leadFilter.assigned_to.$in } };
      } else {
        activityUserFilter = { user_id: leadFilter.assigned_to };
      }
    }

    // Aggregate statistics
    const [
      totalLeads,
      leadsByStatus,
      leadsBySource,
      avgLeadValue,
      recentActivities,
      conversionRate,
    ] = await Promise.all([
      Lead.countDocuments(leadFilter),

      Lead.aggregate([
        { $match: leadFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      Lead.aggregate([
        { $match: leadFilter },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]),

      Lead.aggregate([
        { $match: { ...leadFilter, lead_value: { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: "$lead_value" } } },
      ]),

      Activity.find(activityUserFilter)
        .populate("lead_id", "first_name last_name company")
        .populate("user_id", "name")
        .sort({ createdAt: -1 })
        .limit(10),

      // Calculate conversion rate (won / total)
      Lead.aggregate([
        { $match: leadFilter },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            won: {
              $sum: { $cond: [{ $eq: ["$status", "won"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            conversionRate: {
              $cond: [
                { $eq: ["$total", 0] },
                0,
                { $multiply: [{ $divide: ["$won", "$total"] }, 100] },
              ],
            },
          },
        },
      ]),
    ]);

    res.json({
      totalLeads,
      leadsByStatus,
      leadsBySource,
      avgLeadValue: avgLeadValue[0]?.avg || 0,
      recentActivities,
      conversionRate: conversionRate[0]?.conversionRate || 0,
    });
  } catch (err) {
    console.error("Overview error:", err);
    next(err);
  }
});

// Sales funnel visualization data
router.get("/funnel", auth, async (req, res, next) => {
  try {
    const { managerId, userId } = req.query;

    const matchFilter = {};

    if (req.user.role === "admin") {
      if (userId) {
        matchFilter.assigned_to = userId;
      } else if (managerId) {
        const team = await Team.findOne({ manager: managerId });
        if (team) {
          matchFilter.assigned_to = { $in: [...team.sales_reps, team.manager] };
        }
      }
    } else if (req.user.role === "manager") {
      const team = await Team.findOne({ manager: req.user._id });
      if (team) {
        matchFilter.assigned_to = { $in: [...team.sales_reps, req.user._id] };
      } else {
        matchFilter.assigned_to = req.user._id;
      }
    } else {
      matchFilter.assigned_to = req.user._id;
    }

    const funnel = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: { $ifNull: ["$lead_value", 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(funnel);
  } catch (err) {
    console.error("Funnel error:", err);
    next(err);
  }
});

// Performance by sales rep
router.get("/sales-rep-performance", auth, async (req, res, next) => {
  try {
    const { managerId, userId } = req.query;

    const matchFilter = { assigned_to: { $exists: true, $ne: null } };

    if (req.user.role === "admin") {
      // Admin with filters
      if (userId) {
        matchFilter.assigned_to = userId;
      } else if (managerId) {
        const team = await Team.findOne({ manager: managerId });
        if (team) {
          matchFilter.assigned_to = { $in: [...team.sales_reps, team.manager] };
        }
      }
      // If no filters, show all
    } else if (req.user.role === "manager") {
      const team = await Team.findOne({ manager: req.user._id });
      if (team) {
        matchFilter.assigned_to = { $in: [...team.sales_reps, req.user._id] };
      } else {
        matchFilter.assigned_to = req.user._id;
      }
    } else {
      matchFilter.assigned_to = req.user._id;
    }

    const performance = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: "$assigned_to",
          totalLeads: { $sum: 1 },
          wonLeads: {
            $sum: { $cond: [{ $eq: ["$status", "won"] }, 1, 0] },
          },
          totalValue: {
            $sum: {
              $cond: [
                { $eq: ["$status", "won"] },
                { $ifNull: ["$lead_value", 0] },
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          role: "$user.role",
          totalLeads: 1,
          wonLeads: 1,
          totalValue: 1,
          conversionRate: {
            $cond: [
              { $eq: ["$totalLeads", 0] },
              0,
              { $multiply: [{ $divide: ["$wonLeads", "$totalLeads"] }, 100] },
            ],
          },
        },
      },
      { $sort: { totalValue: -1 } },
    ]);

    res.json(performance);
  } catch (err) {
    console.error("Performance error:", err);
    next(err);
  }
});
// Get managers with their teams for admin dropdown
router.get("/managers", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Only return teams whose manager is NOT an admin
    const teams = await Team.find()
      .populate({
        path: "manager",
        match: { role: { $ne: "admin" } }, // 👈 Exclude admins
        select: "name email role",
      })
      .populate("sales_reps", "name email");

    // Filter out any teams where manager became null after filtering
    const filteredTeams = teams.filter((team) => team.manager);

    res.json(filteredTeams);
  } catch (err) {
    console.error("Managers error:", err);
    next(err);
  }
});

// Get sales reps for a specific manager (for admin view)
router.get("/team-members/:managerId", auth, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const team = await Team.findOne({ manager: req.params.managerId })
      .populate("sales_reps", "name email")
      .populate("manager", "name email");

    if (!team) {
      return res.json([]);
    }

    res.json([team.manager, ...team.sales_reps]);
  } catch (err) {
    console.error("Team members error:", err);
    next(err);
  }
});

module.exports = router;
