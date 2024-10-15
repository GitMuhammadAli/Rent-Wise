const RentalItem = require("../../model/RentalItemModel");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE } = require("../../messages/response");
const { STATUS } = require("../../messages/status");



exports.CreateListings = async (req, res) => {
    try {
        const {
            owner,
            title,
            description,
            price,
            category,
            location,
            amenities = [], // Default to an empty array if not provided
            rules = [], // Default to an empty array if not provided
            availability = [], // Default to an empty array if not provided
            images = [], // Default to an empty array if not provided
            videos = [], // Default to an empty array if not provided
            ratings = [], // Default to an empty array if not provided
            averageRating = 0, // Default rating to 0 if not provided
            status = "pending", // Default to 'pending' if not provided
            priceUnit,
            createdAt = Date.now(), // Default to current timestamp if not provided
            updatedAt = Date.now(), // Default to current timestamp if not provided
        } = req.body;

        // Create a new listing with the provided data
        const newListing = new RentalItem({
            owner,
            title,
            description,
            price,
            category,
            location,
            amenities,
            rules,
            availability,
            images,
            videos,
            ratings,
            priceUnit,
            averageRating,
            status,
            createdAt,
            updatedAt,
        });

        // Save to the database
        await newListing.save();
        return res.status(201).json(newListing);
    } catch (error) {
        console.error("Error creating listing:", error);
        return res.status(500).json({ error: "Failed to create listing" });
    }
};




exports.UpdateListings = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        price,
        category,
        location,
        amenities,
        rules,
        availability,
        images,
        videos,
        ratings,
        averageRating,
        status,
        createdAt,
        updatedAt,
    } = req.body;

    try {
        const updatedListing = await RentalItem.findByIdAndUpdate(
            id,
            {
                title,
                description,
                price,
                category,
                location,
                amenities,
                rules,
                availability,
                images,
                videos,
                ratings,
                averageRating,
                status,
                createdAt,
                updatedAt,
            },
            { new: true }
        );
        if (!updatedListing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(updatedListing);

    } catch (error) {
        res.status(500).json({ error: "Failed to update listing" });
    }
}




exports.DeleteListings = async (req, res) => {
    const { id } = req.params; 

    try {
      // Find the rental item by ID
      const rentalItem = await RentalItem.findById(id);
  
      if (!rentalItem) {
        return res.status(404).json({ message: 'Rental item not found' });
      }
  
      rentalItem.images.forEach((image) => {
        const filePath = path.join(__dirname, image.url); // Adjust if your URL structure differs
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Deletes the file from the filesystem
        }
      });
  
      // Optionally delete videos as well
      rentalItem.videos.forEach((video) => {
        const filePath = path.join(__dirname, video.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
  
      // Delete the rental item from the database
      await RentalItem.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Rental item deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}


exports.GetListings = async (req, res) => {
    try {
        const listings = await RentalItem.find();
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
}

exports.GetListingsById = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await RentalItem.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(listing);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listing" });
    }
}



exports.GetListingByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await RentalItem.find({ owner: id });
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(listing);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listing" });
    }
}


exports.GetALLListingByOwners = async (req, res) => {

    try {

        const listing = await RentalItem.find().populate("owner", "name email");
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(listing);


    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listing" });

    }

}
exports.GetALLListingByOwnersId = async (req, res) => {

    const { id } = req.params;
    try {

        const listing = await RentalItem.find({ owner: id }).populate("owner", "name email");
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(listing);


    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listing" });

    }

}