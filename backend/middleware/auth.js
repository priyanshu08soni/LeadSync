const jwt = require('jsonwebtoken');
module.exports = function(req,res,next){
  try{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message:'Unauthorized'});
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  }catch(err){
    return res.status(401).json({message:'Unauthorized'});
  }
};
