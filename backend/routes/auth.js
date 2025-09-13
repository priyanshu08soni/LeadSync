const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

function signToken(user){
  return jwt.sign({id:user._id, email:user.email}, process.env.JWT_SECRET, {expiresIn:'7d'});
}

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const user = new User({ email, password, name });
    await user.save();

    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: 'User created',
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    next(err);
  }
});


router.post('/login', async (req,res,next)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(401).json({message:'User not found'});

    const ok = await user.comparePassword(password);
    if(!ok) return res.status(401).json({message:'Invalid credentials'});

    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7*24*60*60*1000
    });
    res.json({message:'Logged in', user:{id:user._id, email:user.email, name:user.name}});
  }catch(err){ next(err); }
});

router.get('/me', async (req,res,next)=>{
  try{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message:'Unauthorized'});
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await require('../models/User').findById(payload.id).select('-password');
    if(!user) return res.status(401).json({message:'Unauthorized'});
    res.json({user});
  }catch(err){ res.status(401).json({message:'Unauthorized'}); }
});

router.post('/logout', (req,res)=>{
  res.clearCookie('token', { httpOnly:true, sameSite:'lax', secure: process.env.NODE_ENV==='production' });
  res.json({message:'Logged out'});
});

module.exports = router;
