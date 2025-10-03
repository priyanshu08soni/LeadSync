const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Log a new activity
router.post('/', auth, async (req, res, next) => {
  try {
    const activity = new Activity({
      ...req.body,
      user_id: req.user._id
    });
    await activity.save();
    
    await activity.populate('user_id', 'name email');
    
    res.status(201).json(activity);
  } catch(err) { 
    next(err); 
  }
});

// Get activities for a lead
router.get('/lead/:leadId', auth, async (req, res, next) => {
  try {
    const activities = await Activity.find({ lead_id: req.params.leadId })
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(activities);
  } catch(err) { 
    next(err); 
  }
});

module.exports = router;