// backend/validation/leadValidation.js
const Joi = require('joi');

const createLeadSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  company: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  source: Joi.string().valid('website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other').optional(),
  status: Joi.string().valid('new', 'contacted', 'qualified', 'lost', 'won').optional(),
  score: Joi.number().min(0).max(100).optional(),
  lead_value: Joi.number().min(0).optional()
});

function validateCreateLead(req, res, next) {
  const { error } = createLeadSchema.validate(req.body);
  if (error) {
    return res.status(400).json({message: error.details[0].message});
  }
  next();
}

module.exports = { validateCreateLead };