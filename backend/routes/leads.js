const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

function buildFilter(q){
  const filter = {};
  if(q.email_contains) filter.email = { $regex: q.email_contains, $options:'i' };
  if(q.company_contains) filter.company = { $regex: q.company_contains, $options:'i' };
  if(q.city_contains) filter.city = { $regex: q.city_contains, $options:'i' };
  if(q.status) filter.status = { $in: q.status.split(',') };
  if(q.source) filter.source = { $in: q.source.split(',') };
  if(q.score_gt) filter.score = {...(filter.score||{}), $gt: Number(q.score_gt)};
  if(q.score_lt) filter.score = {...(filter.score||{}), $lt: Number(q.score_lt)};
  if(q.score_eq) filter.score = Number(q.score_eq);
  if(q.is_qualified) filter.is_qualified = q.is_qualified === 'true';
  return filter;
}

router.post('/', auth, async (req,res,next)=>{
  try{
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  }catch(err){ next(err); }
});

router.get('/', auth, async (req,res,next)=>{
  try{
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const skip = (page-1)*limit;
    const filter = buildFilter(req.query);

    const [total, data] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter).sort({createdAt:-1}).skip(skip).limit(limit)
    ]);

    res.json({ data, page, limit, total, totalPages: Math.ceil(total/limit) });
  }catch(err){ next(err); }
});

router.get('/:id', auth, async (req,res,next)=>{
  const lead = await Lead.findById(req.params.id);
  if(!lead) return res.status(404).json({message:'Not found'});
  res.json(lead);
});

router.put('/:id', auth, async (req,res,next)=>{
  try{
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
    if(!lead) return res.status(404).json({message:'Not found'});
    res.json(lead);
  }catch(err){ next(err); }
});

router.delete('/:id', auth, async (req,res,next)=>{
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if(!lead) return res.status(404).json({message:'Not found'});
  res.json({message:'Deleted'});
});

module.exports = router;
