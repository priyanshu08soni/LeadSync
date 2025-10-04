// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// Helper function to get accessible user IDs based on role
async function getAccessibleUserIds(req) {
  const user = req.user;
  
  if (user.role === 'admin') {
    // Admin can see all users
    return null; // null means no filter
  } else if (user.role === 'manager') {
    // Manager can see their own team members
    const team = await Team.findOne({ manager: user.id });
    if (!team) return [user.id]; // If no team, only show own data
    return [...team.sales_reps, user.id]; // Include manager and their sales reps
  } else {
    // Sales rep can only see their own data
    return [user.id];
  }
}

// Overview stats
router.get('/overview', auth, async (req, res, next) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    const leadFilter = {};
    if (Object.keys(dateFilter).length > 0) {
      leadFilter.createdAt = dateFilter;
    }
    
    // Apply role-based filtering
    const accessibleUserIds = await getAccessibleUserIds(req);
    
    if (userId && req.user.role === 'admin') {
      // Admin can filter by specific user
      leadFilter.assigned_to = userId;
    } else if (accessibleUserIds) {
      // Manager or sales_rep: filter by accessible users
      leadFilter.assigned_to = { $in: accessibleUserIds };
    }
    // If accessibleUserIds is null (admin without userId filter), no assigned_to filter
    
    // Aggregate statistics
    const [
      totalLeads,
      leadsByStatus,
      leadsBySource,
      avgLeadValue,
      recentActivities,
      conversionRate
    ] = await Promise.all([
      Lead.countDocuments(leadFilter),
      
      Lead.aggregate([
        { $match: leadFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      Lead.aggregate([
        { $match: leadFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]),
      
      Lead.aggregate([
        { $match: { ...leadFilter, lead_value: { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$lead_value' } } }
      ]),
      
      Activity.find(accessibleUserIds ? { user_id: { $in: accessibleUserIds } } : {})
        .populate('lead_id', 'first_name last_name company')
        .populate('user_id', 'name')
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
              $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            conversionRate: {
              $multiply: [{ $divide: ['$won', '$total'] }, 100]
            }
          }
        }
      ])
    ]);
    
    res.json({
      totalLeads,
      leadsByStatus,
      leadsBySource,
      avgLeadValue: avgLeadValue[0]?.avg || 0,
      recentActivities,
      conversionRate: conversionRate[0]?.conversionRate || 0
    });
  } catch(err) { next(err); }
});

// Sales funnel visualization data
router.get('/funnel', auth, async (req, res, next) => {
  try {
    const accessibleUserIds = await getAccessibleUserIds(req);
    const matchFilter = accessibleUserIds 
      ? { assigned_to: { $in: accessibleUserIds } }
      : {};
    
    const funnel = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $ifNull: ['$lead_value', 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json(funnel);
  } catch(err) { next(err); }
});

// Performance by sales rep
router.get('/sales-rep-performance', auth, async (req, res, next) => {
  try {
    const accessibleUserIds = await getAccessibleUserIds(req);
    
    const matchFilter = { assigned_to: { $exists: true, $ne: null } };
    if (accessibleUserIds) {
      matchFilter.assigned_to = { $in: accessibleUserIds };
    }
    
    const performance = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$assigned_to',
          totalLeads: { $sum: 1 },
          wonLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] }
          },
          totalValue: {
            $sum: { $cond: [{ $eq: ['$status', 'won'] }, { $ifNull: ['$lead_value', 0] }, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          role: '$user.role',
          totalLeads: 1,
          wonLeads: 1,
          totalValue: 1,
          conversionRate: {
            $multiply: [{ $divide: ['$wonLeads', '$totalLeads'] }, 100]
          }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);
    
    res.json(performance);
  } catch(err) { next(err); }
});

// Get managers with their teams for admin dropdown
router.get('/managers', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const teams = await Team.find()
      .populate('manager', 'name email')
      .populate('sales_reps', 'name email');
    
    res.json(teams);
  } catch(err) { next(err); }
});

// Get sales reps for a specific manager (for admin view)
router.get('/team-members/:managerId', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const team = await Team.findOne({ manager: req.params.managerId })
      .populate('sales_reps', 'name email')
      .populate('manager', 'name email');
    
    if (!team) {
      return res.json([]);
    }
    
    res.json([team.manager, ...team.sales_reps]);
  } catch(err) { next(err); }
});

module.exports = router;