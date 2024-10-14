const express = require("express");
const router = express.Router();
const rentalController = require("../../controller/listings/listingController");
const upload = require("../../utils/media");

// Route to create a new listing
router.post("/create", rentalController.CreateListings);

// Route to update a listing by ID
router.put("/update/:id", rentalController.UpdateListings);

// Route to delete a listing by ID
router.delete("/delete/:id", rentalController.DeleteListings);

// Route to get all listings
router.get("/all", rentalController.GetListings);

// Route to get a single listing by listing ID
router.get("/:id", rentalController.GetListingsById);

// Route to get all listings by a specific user (by user ID)
router.get("/user/:id", rentalController.GetListingByUserId);

// Route to get all listings with populated owner details (name and email)
router.get("/all/owners", rentalController.GetALLListingByOwners);

// Route to get all listings by a specific owner with populated owner details (name and email)
router.get("/owner/:id", rentalController.GetALLListingByOwnersId);

module.exports = router;
