const mongoose = require('mongoose');
module.exports = async function connectDB(){
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true, useUnifiedTopology:true
  });
  console.log('Mongo connected');
};
