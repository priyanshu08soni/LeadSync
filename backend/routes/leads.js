const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const auth = require("../middleware/auth");
const { sendEmail } = require("../config/email");
const Team = require("../models/Team");
function buildFilter(q) {
  const filter = {};

  // Text search (searches across multiple fields)
  if (q.search) {
    filter.$or = [
      { first_name: { $regex: q.search, $options: "i" } },
      { last_name: { $regex: q.search, $options: "i" } },
      { email: { $regex: q.search, $options: "i" } },
      { company: { $regex: q.search, $options: "i" } },
      { phone: { $regex: q.search, $options: "i" } },
    ];
  }

  // Individual field filters
  if (q.email_contains)
    filter.email = { $regex: q.email_contains, $options: "i" };
  if (q.company_contains)
    filter.company = { $regex: q.company_contains, $options: "i" };
  if (q.city_contains) filter.city = { $regex: q.city_contains, $options: "i" };
  if (q.state) filter.state = q.state;

  // Multi-select filters
  if (q.status) filter.status = { $in: q.status.split(",") };
  if (q.source) filter.source = { $in: q.source.split(",") };

  // Numeric range filters
  if (q.score_min || q.score_max) {
    filter.score = {};
    if (q.score_min) filter.score.$gte = Number(q.score_min);
    if (q.score_max) filter.score.$lte = Number(q.score_max);
  }

  if (q.value_min || q.value_max) {
    filter.lead_value = {};
    if (q.value_min) filter.lead_value.$gte = Number(q.value_min);
    if (q.value_max) filter.lead_value.$lte = Number(q.value_max);
  }

  // Boolean filters
  if (q.is_qualified !== undefined) {
    filter.is_qualified = q.is_qualified === "true";
  }

  // Assignment filters
  if (q.assigned_to) {
    filter.assigned_to = q.assigned_to === "unassigned" ? null : q.assigned_to;
  }
  if (q.unassigned === "true") {
    filter.assigned_to = null;
  }

  // Date range filters
  if (q.created_after || q.created_before) {
    filter.createdAt = {};
    if (q.created_after) filter.createdAt.$gte = new Date(q.created_after);
    if (q.created_before) filter.createdAt.$lte = new Date(q.created_before);
  }

  if (q.activity_after || q.activity_before) {
    filter.last_activity_at = {};
    if (q.activity_after)
      filter.last_activity_at.$gte = new Date(q.activity_after);
    if (q.activity_before)
      filter.last_activity_at.$lte = new Date(q.activity_before);
  }

  return filter;
}

router.post("/", auth, async (req, res, next) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
});

router.get("/", auth, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    let filter = buildFilter(req.query);

    if (req.user.role !== "admin") {
      // Manager or Sales Rep → find their team
      const team = await Team.findById(req.user.team).populate("sales_reps", "_id manager");
      if (!team) {
        return res.json({ data: [], page, limit, total: 0, totalPages: 0 });
      }

      // Collect all user IDs in this team (sales reps + manager)
      const teamUserIds = [
        team.manager,
        ...team.sales_reps.map((rep) => rep._id),
      ];

      filter.assigned_to = { $in: teamUserIds };
    }
    // Admin → no filter (sees everything)

    const [total, data] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("assigned_to", "name email role team"),
    ]);

    res.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});



router.get("/:id", auth, async (req, res, next) => {
  const lead = await Lead.findById(req.params.id).populate(
    "assigned_to",
    "name email"
  );
  if (!lead) return res.status(404).json({ message: "Not found" });
  res.json(lead);
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Not found" });

    // Role-based rules
    if (req.user.role === "sales_rep") {
      // Sales rep can only update their own leads
      if (lead.assigned_to.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to edit this lead" });
      }

      // Prevent sales rep from reassigning lead
      delete req.body.assigned_to;
    }

    if (req.user.role === "manager") {
      // Manager can only update leads of their team
      // Assuming Lead has a "manager" field or sales rep has "manager" reference
      // Example check: (pseudo logic, adjust as per your schema)
      if (String(lead.manager) !== String(req.user._id)) {
        return res
          .status(403)
          .json({ message: "Not authorized to edit this lead" });
      }
    }

    // Admin: no restrictions

    // Apply allowed updates
    Object.assign(lead, req.body);
    await lead.save();

    res.json(lead);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
});

router.patch("/:id/assign", auth, async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Verify the user exists and is active
    const assignee = await User.findById(userId);
    if (!assignee || !assignee.isActive) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        assigned_to: userId,
        assigned_at: new Date(),
      },
      { new: true }
    ).populate("assigned_to", "name email role");

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json(lead);
  } catch (err) {
    next(err);
  }
});

// Enhanced GET route with sorting
router.get("/", auth, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const filter = buildFilter(req.query);

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const [total, data] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .populate("assigned_to", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit),
    ]);

    res.json({
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// backend/routes/leads.js - Bulk operations
router.patch("/bulk/assign", auth, async (req, res, next) => {
  try {
    const { leadIds, userId } = req.body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res
        .status(400)
        .json({ message: "leadIds must be a non-empty array" });
    }

    const result = await Lead.updateMany(
      { _id: { $in: leadIds } },
      {
        assigned_to: userId,
        assigned_at: new Date(),
      }
    );

    res.json({
      message: "Bulk assignment completed",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    next(err);
  }
});

router.patch("/bulk/status", auth, async (req, res, next) => {
  try {
    const { leadIds, status } = req.body;

    const result = await Lead.updateMany({ _id: { $in: leadIds } }, { status });

    res.json({
      message: "Bulk status update completed",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/bulk", auth, async (req, res, next) => {
  try {
    const { leadIds } = req.body;

    const result = await Lead.deleteMany({ _id: { $in: leadIds } });

    res.json({
      message: "Bulk delete completed",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    next(err);
  }
});

// backend/routes/leads.js - Send email to lead
router.post("/:id/send-email", auth, async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead || !lead.email) {
      return res.status(404).json({ message: "Lead not found or no email" });
    }

    await sendEmail({
      to: lead.email,
      subject,
      html: message,
      text: message.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    });

    // Log the activity
    await Activity.create({
      lead_id: lead._id,
      user_id: req.user.id,
      type: "email",
      description: `Sent email: ${subject}`,
    });

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
