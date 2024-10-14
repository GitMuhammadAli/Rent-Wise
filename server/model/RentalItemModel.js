const mongoose = require("mongoose");
const User = require("./userModel");

const RentalItemSchema = mongoose.Schema;

const RentalSchema = new RentalItemSchema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["car", "bike", "hotel", "apartment", "house", "other"],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceUnit: {
    type: String,
    enum: ["hour", "day", "week", "month"],
    required: true,
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
  },
  amenities: [{ type: String }],
  rules: [{ type: String }],
  availability: [
    {
      startDate: { type: Date },
      endDate: { type: Date },
    },
  ],
  images: [
    {
      url: { type: String, required: true },
      caption: { type: String },
    },
  ],
  videos: [
    {
      url: { type: String, required: true },
      caption: { type: String },
    },
  ],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
    },
  ],
  averageRating: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const RentalItem = mongoose.model("RentalItem", RentalSchema);
module.exports = RentalItem;
