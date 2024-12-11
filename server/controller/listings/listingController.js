const RentalItem = require("../../model/listings/RentalItemModel");
const path = require("path");
const logger = require("../../utils/logger");
const fs = require("fs");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE, LISTINGS } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const Video = require("../../model/listings/VediosModel");
const Image = require("../../model/listings/ImagesModel");
const Location = require("../../model/listings/LocationModel");
const Bidding = require("../../model/listings/biddingModel");



exports.uploadMedia = async (req, res , next) => {
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
        logger.error(error);
        next(error);
    }
};

// Updated_One-&-Latest
exports.CreateListings = async (req, res , next) => {
    try {
        const { owner, title, description, price, category, priceUnit, amenities = [],
            location, biddingEnabled, minimumBid, bidIncrement, bidEndDate
        } = req.body;

        console.log("body ", req.body);
        const missingFields = [];
        if (!owner) missingFields.push("owner");
        if (!title) missingFields.push("title");
        if (!description) missingFields.push("description");
        if (!price) missingFields.push("price");
        if (!category) missingFields.push("category");
        if (!priceUnit) missingFields.push("priceUnit");


        // if (!location) missingFields.push("location");

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
                images = savedImages.map(img => img._id);
            } catch (error) {
                console.error("Error uploading images:", error);
                logger.error(error);
                return res.status(500).json({ error: LISTINGS.ERROR_UPLOADING_IMAGES });
            }
        }

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
                videos = savedVideos.map(vid => vid._id);
            } catch (error) {
                console.error("Error uploading videos:", error);
                return res.status(500).json({ error: LISTINGS.ERROR_UPLOADING_VIDEOS });
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
            images,
            videos,
            // location: newLocation._id,
        });

        if (biddingEnabled === true) {
            if (!minimumBid || !bidEndDate) {
                return res.status(400).json({
                    error: LISTINGS.BIDDING_ERROR_MISSING_REQUIRED_FIELDS,
                });
            }

            const bidding = new Bidding({
                rentalItem: newRentalItem._id,
                enabled: biddingEnabled,
                minimumBid,
                bidIncrement,
                bidEndDate,
            });

            const savedBidding = await bidding.save();
            newRentalItem.bidding = savedBidding._id;
        }
        await newRentalItem.save();

        console.log("Rental item created:", newRentalItem);


        return res.status(201).json({
            rentalItem: newRentalItem,
            message: LISTINGS.LISTING_CREATED,
        });

    } catch (error) {
        console.error("Error creating rental listing:", error);
        logger.error(error);
        next(error)
    }
};

exports.placeBid = async (req, res) => {
    try {
        const { rentalItemId, bidAmount } = req.body;
        const userId = req.user.id;

        const bidding = await bidding.findOne({ rentalItem: rentalItemId });
        if (!bidding || !bidding.enabled) {
            return res.status(400).json({ error: "Bidding is not enabled for this item." });
        }

        // Check if bidding is still open
        if (new Date() > bidding.bidEndDate) {
            return res.status(400).json({ error: "Bidding has ended." });
        }

        const minimumAllowedBid = bidding.highestBid ? bidding.highestBid + bidding.bidIncrement : bidding.minimumBid;
        if (bidAmount < minimumAllowedBid) {
            return res.status(400).json({
                error: `Bid must be at least ${minimumAllowedBid}.`,
            });
        }

        bidding.highestBid = bidAmount;
        bidding.highestBidder = userId;

        bidding.bids.push({
            user: userId,
            bidAmount,
        });

        await bidding.save();

        return res.status(200).json({ message: "Bid placed successfully!" });
    } catch (error) {
        console.error("Error placing bid:", error);
        return res.status(500).json({ error: "Error placing bid." });
    }
};


const removeFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.warn(`File not found, skipping delete: ${filePath}`);
                return resolve(); // Resolve even if the file is missing
            }
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                    return reject(err);
                }
                console.log(`Successfully deleted file: ${filePath}`);
                resolve();
            });
        });
    });
};

const cleanUpUnreferencedMedia = async (listingId , next) => {
    try {
        // Fetch the updated listing's images and videos
        const listing = await RentalItem.findById(listingId).populate(['images', 'videos']);
        if (!listing) throw new Error('Listing not found');

        // Paths from the database
        const referencedFiles = [
            ...listing.images.map(img => path.basename(img.url)),
            ...listing.videos.map(vid => path.basename(vid.url))
        ];

        // Path to the directory containing the listing's media files
        const mediaDirPath = path.resolve(`uploads/media/${listing.owner}`);
        
        // List all files in the directory
        const allFiles = await fs.promises.readdir(mediaDirPath);

        // Files to delete: those not in `referencedFiles`
        const unreferencedFiles = allFiles.filter(file => !referencedFiles.includes(file));

        // Delete each unreferenced file
        for (const file of unreferencedFiles) {
            const filePath = path.join(mediaDirPath, file);
            await fs.promises.unlink(filePath);
            console.log(`Deleted unreferenced file: ${filePath}`);
        }
        
    } catch (error) {
        console.error('Error during cleanup:', error);
        logger.error(error);
        next(error);
    }
};
exports.UpdateListings = async (req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        price,
        category,
        priceUnit,
        location,
        availability,
        averageRating,
        status
    } = req.body;

    console.log("Received request to update listing", req.body);

    const parsedRemovedImages = JSON.parse(req.body.removedImages || '[]');
    const parsedRemovedVideos = JSON.parse(req.body.removedVideos || '[]');
    const parsedExistingImages = JSON.parse(req.body.existingImages || '[]');
    const parsedExistingVideos = JSON.parse(req.body.existingVideos || '[]');
    const amenities = JSON.parse(req.body.amenities || '[]');
    const rules = JSON.parse(req.body.rules || '[]');

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!price) missingFields.push("price");
    if (!category) missingFields.push("category");
    if (!priceUnit) missingFields.push("priceUnit");

    if (missingFields.length) {
        return res.status(400).json({
            error: `Missing required fields: ${missingFields.join(", ")}`
        });
    }
    const uploadedFilePaths = [];

    try {
        const existingListing = await RentalItem.findById(id).populate("images").populate("videos");
        if (!existingListing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        console.log("Existing listing:", existingListing);

        // Handle removed media
        for (const imageObj of parsedRemovedImages) {
            await Image.findByIdAndDelete(imageObj._id);
            const filePath = path.resolve(`uploads/media/${existingListing.owner}/${path.basename(imageObj.url)}`);
            await removeFile(filePath);
        }

        for (const videoObj of parsedRemovedVideos) {
            await Video.findByIdAndDelete(videoObj._id);
            const filePath = path.resolve(`uploads/media/${existingListing.owner}/${path.basename(videoObj.url)}`);
            await removeFile(filePath);
        }

        // Handle new media
        let finalImageIds = parsedExistingImages.map(img => img._id);
        let finalVideoIds = parsedExistingVideos.map(vid => vid._id);

        try {
            // Process new images
            if (req.files?.['images']) {
                const newImages = await Image.insertMany(
                    req.files['images'].map(file => {
                        const filePath = `/uploads/media/${existingListing.owner}/${file.filename}`;
                        uploadedFilePaths.push(filePath);  // Track for potential cleanup
                        return { url: filePath, caption: "" };
                    })
                );
                finalImageIds = [...finalImageIds, ...newImages.map(img => img._id)];
            }

            // Process new videos
            if (req.files?.['videos']) {
                const newVideos = await Video.insertMany(
                    req.files['videos'].map(file => {
                        const filePath = `/uploads/media/${existingListing.owner}/${file.filename}`;
                        uploadedFilePaths.push(filePath);  // Track for potential cleanup
                        return { url: filePath, caption: "" };
                    })
                );
                finalVideoIds = [...finalVideoIds, ...newVideos.map(vid => vid._id)];
            }
        } catch (mediaError) {
            // If any media insertion fails, delete all uploaded files
            console.error("Error processing media:", mediaError);
            await Promise.all(uploadedFilePaths.map(filePath => removeFile(path.resolve(filePath))));
            return res.status(500).json({ error: "Failed to upload media files", details: mediaError.message });
        }

        // Update listing with all changes
        const updatedListing = await RentalItem.findByIdAndUpdate(
            id,
            {
                title,
                description,
                price,
                category,
                priceUnit,
                location,
                amenities,
                rules,
                availability,
                images: finalImageIds,
                videos: finalVideoIds,
                averageRating,
                status,
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true }
        );
        await cleanUpUnreferencedMedia(id);

        console.log("Updated listing:", updatedListing);

        res.json(updatedListing);
    } catch (error) {
        console.error("Error updating listing:", error);
        await Promise.all(uploadedFilePaths.map(filePath => removeFile(path.resolve(filePath))));
        res.status(500).json({ error: "Failed to update listing", details: error.message });
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

        // Delete images
        for (const image of rentalItem.images) {
            const filePath = path.join(__dirname, "../../..", image.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Deletes the file from the filesystem
            }
            await Image.findByIdAndDelete(image._id); // Delete image from database
        }

        // Delete videos
        for (const video of rentalItem.videos) {
            const filePath = path.join(__dirname, "../../..", video.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Deletes the file from the filesystem
            }
            await Video.findByIdAndDelete(video._id); // Delete video from database
        }

        // Delete the rental item from the database
        await RentalItem.findByIdAndDelete(id);

        res.status(200).json({ message: 'Rental item and associated files deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.GetListings = async (req, res) => {
    try {
        const listings = await RentalItem.find().populate("owner").populate("images").populate("videos").populate("bidding");
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
}


// function to get a single listing by id
exports.GetListingsById = async (req, res) => {
    const { id } = req.params;
    try {

       
        const listing = await RentalItem.findById(id).populate("owner", "name email imageUrl").populate("images", "url caption ").populate("videos", "url caption").populate('bidding')
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(listing);
    } catch (error) {
        res.status(500).json({ error: "Fjadaddsad" });
    }
}


// function to get all the listings by user id
exports.GetListingByUserId = async (req, res) => {
    const { id } = req.params;
    try {
       
        const listing = await RentalItem.find({ owner: id });
        const count = await RentalItem.countDocuments({ owner: id });
      

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json({listing,count});
        console.log("Count of this owner is:", count)
        
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




// exports.UpdateListings = async (req, res) => {
//     const { id } = req.params;
//     const {
//         title,
//         description,
//         price,
//         category,
//         priceUnit,
//         location,
//         availability,
//         averageRating,
//         status
//     } = req.body;

//     console.log("Received request to update listing" , req.body);
//     // Parse JSON data
//     const parsedRemovedImages = JSON.parse(req.body.removedImages || '[]');
//     const parsedRemovedVideos = JSON.parse(req.body.removedVideos || '[]');
//     const parsedExistingImages = JSON.parse(req.body.existingImages || '[]');
//     const parsedExistingVideos = JSON.parse(req.body.existingVideos || '[]');
//     const amenities = JSON.parse(req.body.amenities || '[]');
//     const rules = JSON.parse(req.body.rules || '[]');

//     // Validate required fields
//     const missingFields = [];
//     if (!title) missingFields.push("title");
//     if (!description) missingFields.push("description");
//     if (!price) missingFields.push("price");
//     if (!category) missingFields.push("category");
//     if (!priceUnit) missingFields.push("priceUnit");

//     if (missingFields.length) {
//         return res.status(400).json({
//             error: `Missing required fields: ${missingFields.join(", ")}`
//         });
//     }

//     try {
//         const existingListing = await RentalItem.findById(id);
//         if (!existingListing) {
//             return res.status(404).json({ error: "Listing not found" });
//         }

//         // Handle removed media
//         for (const imageObj of parsedRemovedImages) {
//             await Image.findByIdAndDelete(imageObj._id);
//             const filePath = path.resolve(__dirname, `../uploads/media/${existingListing.owner}/${path.basename(imageObj.url)}`);
//             await removeFile(filePath);
//         }

//         for (const videoObj of parsedRemovedVideos) {
//             await Video.findByIdAndDelete(videoObj._id);
//             const filePath = path.resolve(__dirname, `../uploads/media/${existingListing.owner}/${path.basename(videoObj.url)}`);
//             await removeFile(filePath);
//         }

//         // Handle new media
//         let finalImageIds = parsedExistingImages.map(img => img._id);
//         let finalVideoIds = parsedExistingVideos.map(vid => vid._id);

//         // Process new images
//        // Process new images
// if (req.files?.['images']) {
//     const newImages = await Image.insertMany(
//         req.files['images'].map(file => ({
//             url: `/uploads/media/${existingListing.owner}/${file.filename}`,
//             caption: ""
//         }))
//     );
//     finalImageIds = [...finalImageIds, ...newImages.map(img => img._id)];
// }

// // Process new videos
// if (req.files?.['vedios']) {
//     const newVideos = await Video.insertMany(
//         req.files['vedios'].map(file => ({
//             url: `/uploads/media/${existingListing.owner}/${file.filename}`,
//             caption: ""
//         }))
//     );
//     finalVideoIds = [...finalVideoIds, ...newVideos.map(vid => vid._id)];
// }


//         // Update listing with all changes
//         const updatedListing = await RentalItem.findByIdAndUpdate(
//             id,
//             {
//                 title,
//                 description,
//                 price,
//                 category,
//                 priceUnit,
//                 location,
//                 amenities,
//                 rules,
//                 availability,
//                 images: finalImageIds,
//                 videos: finalVideoIds,
//                 averageRating,
//                 status,
//                 updatedAt: Date.now(),
//             },
//             { new: true, runValidators: true }
//         );

//         res.json(updatedListing);
//     } catch (error) {
//         console.error("Error updating listing:", error);
//         res.status(500).json({ error: "Failed to update listing", details: error.message });
//     }
// };

// // Utility function to remove files
// const removeFile = (filePath) => {
//     return new Promise((resolve, reject) => {
//         fs.unlink(filePath, (err) => {
//             if (err) {
//                 console.error(`Error deleting file: ${filePath}`, err);
//                 reject(err);
//             } else {
//                 console.log(`Successfully deleted file: ${filePath}`);
//                 resolve();
//             }
//         });
//     });
// };
