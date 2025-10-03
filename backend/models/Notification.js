// backend/models/Notification.js
const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["lead_assigned", "status_change", "activity_reminder", "system"],
      required: true,
    },
    title: String,
    message: String,
    lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    read_at: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
