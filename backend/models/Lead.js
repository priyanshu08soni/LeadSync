const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {type:String, required:true, unique:true},
  phone: String,
  company: String,
  city: String,
  state: String,
  source: {type:String, enum:['website','facebook_ads','google_ads','referral','events','other']},
  status: {type:String, enum:['new','contacted','qualified','lost','won'], default:'new'},
  score: {type:Number, min:0, max:100},
  lead_value: Number,
  last_activity_at: {type:Date, default:null},
  is_qualified: {type:Boolean, default:false},
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assigned_at: {
    type: Date,
    default: null
  }
}, {timestamps:true});

leadSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  if (update.status || update.$set?.status) {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      const Activity = require('./Activity');
      await Activity.create({
        lead_id: docToUpdate._id,
        user_id: update.$set?.updated_by || update.updated_by,
        type: 'status_change',
        description: `Status changed from ${docToUpdate.status} to ${update.status || update.$set.status}`,
        metadata: {
          old_status: docToUpdate.status,
          new_status: update.status || update.$set.status
        }
      });
    }
  }
  next();
});
module.exports = mongoose.model('Lead', leadSchema);
