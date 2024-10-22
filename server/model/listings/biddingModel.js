const mongoose = require("mongoose");

const BiddingSchema = new mongoose.Schema({
    rentalItem: { type: mongoose.Schema.Types.ObjectId, ref: "RentalItem", required: true },
    enabled: { type: Boolean, default: false },
    minimumBid: { type: Number, required: true },
    bidIncrement: { type: Number, default: 1 },
    endDate: { type: Date, required: true },
    bids: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            bidAmount: { type: Number, required: true },
            bidDate: { type: Date, default: Date.now },
        },
    ],
    highestBid: { type: Number, default: 0 },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

});


const bidding = mongoose.model("bidding", BiddingSchema);
module.exports = bidding