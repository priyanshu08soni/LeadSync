// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roles');

// Overview stats
router.get('/overview', auth, checkRole('admin', 'manager'), async (req, res, next) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    const leadFilter = {};
    if (Object.keys(dateFilter).length > 0) {
      leadFilter.createdAt = dateFilter;
    }
    if (userId) {
      leadFilter.assigned_to = userId;
    }
    
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
      
      Activity.find(leadFilter.assigned_to ? { user_id: leadFilter.assigned_to } : {})
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
router.get('/funnel', auth, checkRole('admin', 'manager'), async (req, res, next) => {
  try {
    const funnel = await Lead.aggregate([
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
router.get('/sales-rep-performance', auth, checkRole('admin', 'manager'), async (req, res, next) => {
  try {
    const performance = await Lead.aggregate([
      { $match: { assigned_to: { $exists: true, $ne: null } } },
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

module.exports = router;