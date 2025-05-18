// models/notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["follow", "like", "comment", "mention", "job"],
  },
  actorId: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
    default: null,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  deliveryChannels: {
    type: [String],
    default: ["in-app"],
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
