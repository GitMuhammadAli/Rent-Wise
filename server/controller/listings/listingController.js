const RentalItem = require("../../model/listings/RentalItemModel");
const path = require("path");
const fs = require("fs");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE, LISTINGS } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const Video = require("../../model/listings/VediosModel");
const Image = require("../../model/listings/ImagesModel");
const Location = require("../../model/listings/LocationModel");



// old one

// exports.CreateListings = async (req, res) => {
//     try {
//         const {
//             owner,
//             title,
//             description,
//             price,
//             category,
//             location,
//             amenities = [], // Default to an empty array if not provided
//             rules = [], // Default to an empty array if not provided
//             availability = [], // Default to an empty array if not provided
//             ratings = [], // Default to an empty array if not provided
//             averageRating = 0, // Default rating to 0 if not provided
//             status = "pending", // Default to 'pending' if not provided
//             priceUnit,
//             createdAt = Date.now(), // Default to current timestamp if not provided
//             updatedAt = Date.now(), // Default to current timestamp if not provided
//         } = req.body;

//         // Handle image uploads
//         let images = [];
//         if (req.files && req.files['images']) {
//             images = req.files['images'].map(file => ({
//                 url: `/uploads/media/${owner}/${file.filename}`,
//                 caption: ""
//             }));
//         }
//         else{
//             images = [];
//         }

//         // Handle video uploads
//         let videos = [];
//         if (req.files && req.files['videos']) {
//             videos = req.files['videos'].map(file => ({
//                 url: `/uploads/media/${owner}/${file.filename}`,
//                 caption: ""
//             }));
//         }
//         else {
//             videos = [];
//         }

//         console.log("body " , req.body);
//         console.log("files " , req.files);
//         console.log("images " , images);
//         console.log("videos " , videos);

//         const newListing = new RentalItem({
//             owner,
//             title,
//             description,
//             price,
//             category,
//             location,
//             amenities,
//             rules,
//             availability,
//             images,
//             videos,
//             ratings,
//             priceUnit,
//             averageRating,
//             status,
//             createdAt,
//             updatedAt,
//         });

//         console.log("New Listing", newListing);    
//         await newListing.save();
//         console.log("New Listing saved is :", newListing);    

//         return res.status(201).json(newListing);
//     } catch (error) {
//         console.error("Error creating listing:", error);
//         return res.status(500).json({ error: "Failed to create listing" });
//     }
// };



// html one
// exports.CreateListings = async (req, res) => {
//     try {
//         const {
//             owner,
//             title,
//             description,
//             price,
//             category,
//             location,
//             amenities = [], // Default to an empty array if not provided
//             rules = [], // Default to an empty array if not provided
//             availability = [], // Default to an empty array if not provided
//             ratings = [], // Default to an empty array if not provided
//             averageRating = 0, // Default rating to 0 if not provided
//             status = "pending", // Default to 'pending' if not provided
//             priceUnit,
//             createdAt = Date.now(), // Default to current timestamp if not provided
//             updatedAt = Date.now(), // Default to current timestamp if not provided
//         } = req.body;

//         // Ensure availability and ratings are parsed correctly
//         const parsedAvailability = availability.length ? JSON.parse(availability) : [];
//         const parsedRatings = ratings.length ? JSON.parse(ratings) : [];

//         // Handle image uploads
//         let images = [];
//         if (req.files && req.files['images']) {
//             images = req.files['images'].map(file => ({
//                 url: `/uploads/media/${owner}/${file.filename}`,
//                 caption: ""
//             }));
//         }

//         // Handle video uploads
//         let videos = [];
//         if (req.files && req.files['videos']) {
//             videos = req.files['videos'].map(file => ({
//                 url: `/uploads/media/${owner}/${file.filename}`,
//                 caption: ""
//             }));
//         }

//         console.log("body ", req.body);
//         console.log("files ", req.files);
//         console.log("images ", images);
//         console.log("videos ", videos);

//         const newListing = new RentalItem({
//             owner,
//             title,
//             description,
//             price,
//             category,
//             location,
//             amenities,
//             rules,
//             availability: parsedAvailability,
//             images,
//             videos,
//             ratings: parsedRatings,
//             priceUnit,
//             averageRating,
//             status,
//             createdAt,
//             updatedAt,
//         });

//         console.log("New Listing", newListing);    
//         await newListing.save();
//         console.log("New Listing saved is :", newListing);    

//         return res.status(201).json(newListing);
//     } catch (error) {
//         console.error("Error creating listing:", error);
//         return res.status(500).json({ error: "Failed to create listing" });
//     }
// };


exports.uploadMedia = async (req, res) => {
    try {
        // Handle image uploads
        let images = [];
        if (req.files && req.files['images']) {
            const imagePromises = req.files['images'].map(file => {
                const image = new Image({
                    url: `/uploads/media/${req.body.owner}/${file.filename}`,
                    caption: ""
                });
                return image.save();
            });
            const savedImages = await Promise.all(imagePromises);
            images = savedImages.map(img => img._id); // Store image ObjectIDs
        }

        // Handle video uploads
        let videos = [];
        if (req.files && req.files['videos']) {
            const videoPromises = req.files['videos'].map(file => {
                const video = new Video({
                    url: `/uploads/media/${req.body.owner}/${file.filename}`,
                    caption: ""
                });
                return video.save();
            });
            const savedVideos = await Promise.all(videoPromises);
            videos = savedVideos.map(vid => vid._id); // Store video ObjectIDs
        }

        console.log("Images:", images);
        console.log("Videos:", videos);

        return res.status(200).json({
            message: "Media uploaded successfully",
            images,
            videos
        });
    } catch (error) {
        console.error("Error uploading media:", error);
        return res.status(500).json({ error: "Failed to upload media" });
    }
};

// Updated_One-&-Latest
exports.CreateListings = async (req, res) => {
    try {
        const { owner, title, description, price, category, priceUnit, amenities = [],
            location
        } = req.body;

        // Required field checks
        const missingFields = [];
        if (!owner) missingFields.push("owner");
        if (!title) missingFields.push("title");
        if (!description) missingFields.push("description");
        if (!price) missingFields.push("price");
        if (!category) missingFields.push("category");
        if (!priceUnit) missingFields.push("priceUnit");
        if (!location) missingFields.push("location");


        if (missingFields.length) {
            return res.status(STATUS.BAD_REQUEST).json({
                error: `${LISTINGS.ERROR_MISSING_REQUIRED_FIELDS} ${missingFields.join(", ")}. ${LISTINGS.PLEASE_PROVIDE_ALL_REQUIRED_FIELDS}`.trim()
            });
        }
        let images = [];
        if (req.files && req.files['images']) {
            try {
                const imagePromises = req.files['images'].map(file => {
                    const image = new Image({
                        url: `/uploads/media/${req.body.owner}/${file.filename}`,
                        caption: ""
                    });
                    return image.save();
                });
                const savedImages = await Promise.all(imagePromises);
                images = savedImages.map(img => img._id); // Store image ObjectIDs
            } catch (error) {
                console.error("Error uploading images:", error);
                return res.status(500).json({ error: "Error uploading images." });
            }
        }

        // Handle video uploads (store as objects with url, caption, and _id)
        let videos = [];
        if (req.files && req.files['videos']) {
            try {
                const videoPromises = req.files['videos'].map(file => {
                    const video = new Video({
                        url: `/uploads/media/${req.body.owner}/${file.filename}`,
                        caption: ""
                    });
                    return video.save();
                });
                const savedVideos = await Promise.all(videoPromises);
                videos = savedVideos.map(vid => vid._id); // Store video ObjectIDs
            } catch (error) {
                console.error("Error uploading videos:", error);
                return res.status(500).json({ error: "Error uploading videos." });
            }
        }

        // Create the rental item
        const newRentalItem = new RentalItem({
            owner,
            title,
            description,
            price,
            category,
            priceUnit,
            amenities,
            images, // Store images as array of objects with url, caption, and _id
            videos, // Store videos as array of objects with url, caption, and _id
            // location: newLocation._id, // Reference the location's _id if needed
        });

        // Save the rental item
        await newRentalItem.save();

        // Return the created rental item along with a success message
        return res.status(201).json({
            rentalItem: newRentalItem,
            message: "Listing created successfully."
        });

    } catch (error) {
        console.error("Error creating rental listing:", error);
        return res.status(500).json({ error: "Error creating listing." });
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
        averageRating,
        status,
    } = req.body;

    try {
        // Fetch the existing listing to retrieve old images and videos
        const existingListing = await RentalItem.findById(id);
        if (!existingListing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        // If there are new images uploaded, handle image replacement
        let newImages = existingListing.images; // Default to the existing images
        if (req.files && req.files['images']) {
            // Delete old images from the file system
            existingListing.images.forEach((image) => {
                const oldImagePath = path.join(__dirname, "../../../", image.url);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete old file
                }
            });

            // Save the new images to the listing
            newImages = req.files['images'].map(file => ({
                url: `/uploads/media/${existingListing.owner}/${file.filename}`,
                caption: ""
            }));
        }

        // If there are new videos uploaded, handle video replacement
        let newVideos = existingListing.videos; // Default to the existing videos
        if (req.files && req.files['videos']) {
            // Delete old videos from the file system
            existingListing.videos.forEach((video) => {
                const oldVideoPath = path.join(__dirname, "../../..", video.url);
                if (fs.existsSync(oldVideoPath)) {
                    fs.unlinkSync(oldVideoPath); // Delete old file
                }
            });

            // Save the new videos to the listing
            newVideos = req.files['videos'].map(file => ({
                url: `/uploads/media/${existingListing.owner}/${file.filename}`,
                caption: ""
            }));
        }

        // Update the listing in the database
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
                images: newImages, // Set the new images
                videos: newVideos,  // Set the new videos
                averageRating,
                status,
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true }
        );

        res.json(updatedListing);
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({ error: "Failed to update listing" });
    }
};





exports.DeleteListings = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the rental item by ID
        const rentalItem = await RentalItem.findById(id);

        if (!rentalItem) {
            return res.status(404).json({ message: 'Rental item not found' });
        }

        rentalItem.images.forEach((image) => {
            const filePath = path.join(__dirname, "../../..", image.url);

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
        res.status(500).json({ error: "Fjadaddsad" });
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
exports.AllDetailWithMedia = async (req, res) => {
    try {
        const listing = await RentalItem.find().populate("owner", "name email").populate("images", "url caption ").populate("videos", "url caption");
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(listing);


    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listing" });

    }

}
exports.AllDetailWithMediaWithOwnerID = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await RentalItem.find({ owner: id })
            .populate("owner", "name email")
            .populate("images", "url caption")
            .populate("videos", "url caption");

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        console.log("Fetched Listing:", listing); // Log the fetched listing
        res.json(listing);
    } catch (error) {
        console.error("Error fetching listing:", error); // Log the full error object
        res.status(500).json({ error: "Failed to fetch listing", details: error }); // Include full error object in the response
    }
};
