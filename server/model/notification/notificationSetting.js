const mongoose = require("mongoose");

const UserSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  notificationPreferences: {
    messages: { type: Boolean, default: true },
    reviews: { type: Boolean, default: true },
    bookings: { type: Boolean, default: true },
    payments: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true },
  },
  webPushSubscription: {
    endpoint: { type: String },
    keys: {
      p256dh: { type: String },
      auth: { type: String },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserSettings = mongoose.model("UserSettings", UserSettingsSchema);
module.exports = UserSettings;
