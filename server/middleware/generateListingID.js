const mongoose = require("mongoose");

const ListingID = async(req, res, next) => {
    const listingId =  new mongoose.Types.ObjectId(); // Generate listing ID
    console.log("router created listing id is" , listingId)
    req.listingId = listingId; // Attach to request body
    next();
  }

module.exports = ListingID