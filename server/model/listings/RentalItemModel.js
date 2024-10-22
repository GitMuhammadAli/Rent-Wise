// const mongoose = require("mongoose");
// const User = require("../user/userModel");

// const RentalItemSchema = mongoose.Schema;

// const RentalSchema = new RentalItemSchema({
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   category: {
//     type: String,
//     enum: ["car", "bike", "hotel", "apartment", "house", "other"],
//     required: true,
//   },
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   priceUnit: {
//     type: String,
//     enum: ["hour", "day", "week", "month"],
//     required: true,
//   },
//   location: {
//     address: { type: String, },
//     city: { type: String, },
//     state: { type: String,  }, // required true removed 
//     country: { type: String,  }, // required true removed 
//     zipCode: { type: String,  }, // required true removed 
//     coordinates: {
//       latitude: { type: Number,  }, // required true removed 
//       longitude: { type: Number,  }, // required true removed 
//     },
//   },
//   amenities: [{ type: String }],
//   rules: [{ type: String }],
//   availability: [
//     {
//       startDate: { type: Date },
//       endDate: { type: Date },
//     },
//   ],
//   images: [
//     {
//       url: { type: String,  },   // required true removed 
//       caption: { type: String },
//     },
//   ],
//   videos: [
//     {
//       url: { type: String }, // required true removed 
//       caption: { type: String },
//     },
//   ],
//   ratings: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       rating: { type: Number, min: 1, max: 5 },
//       review: { type: String },
//     },
//   ],
//   averageRating: { type: Number, default: 0 },
//   status: {
//     type: String,
//     enum: ["active", "inactive", "pending"],
//     default: "pending",
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const RentalItem = mongoose.model("RentalItem", RentalSchema);
// module.exports = RentalItem;


const mongoose = require("mongoose");
const RentalSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["car",  "hostel", "apartment", "house"],
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
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", 
    //required: true 
  },
  amenities: [{ type: String }], // Embedding Amenities as an array
  rules: [{ type: String }], // Embedding Rules as an array

  // Referencing images and videos
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],

  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      review: { type: String },
    },
  ],
  averageRating: { type: Number, default: 0 },

  // Referencing bids
  bidding: {
    enabled: { type: Boolean, default: false },
    bids: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        bidAmount: { type: Number },
        bidDate: { type: Date, default: Date.now },
      },
    ],
  },

  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add a pre-save hook to update the updatedAt timestamp
RentalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const RentalItem = mongoose.model("RentalItem", RentalSchema);
module.exports = RentalItem;
