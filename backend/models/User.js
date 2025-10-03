const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: String,
  role: {
    type: String,
    enum: ['admin', 'manager', 'sales_rep'],
    default: 'sales_rep'
  },
  team: String, // Optional: for organizing reps into teams
  isActive: {type: Boolean, default: true}
}, {timestamps: true});

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function(candidate){
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
