const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema(
  {
    lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["call", "email", "meeting", "note", "status_change", "assignment"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      duration: Number, // for calls/meetings (in minutes)
      outcome: String, // 'interested', 'not_interested', 'callback_requested'
      old_status: String, // for status changes
      new_status: String,
    },
  },
  { timestamps: true }
);

activitySchema.index({ lead_id: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
