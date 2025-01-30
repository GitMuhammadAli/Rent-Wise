const Aggrement = require("../../model/agreements/Aggrement");
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const RentalItem = require("../../model/listings/RentalItemModel");
const listingReview = require("../../model/reviews/listingReview");
const { ERROR_MESSAGE } = require("../../messages/error");
const {
  RESPONCE_MESSAGE,
  AGGREEMENT,
  CONVERSATION,
  REVIEWS
} = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const AppError = require("../../utils/AppError");
const { ROLES, BOOLEAN } = require("../../utils/Roles");
const QRCode = require("qrcode");
const { io } = require("../../utils/socket");
const Messsage = require("../../model/chat/MesssageModel");
const Conversation = require("../../model/chat/ConversationModel");

exports.CreateListReview = async (req, res, next) => {
  try {
    const { id } = req.params
    const {  rating, comment } = req.body;
    const userId = req.user._id;


    console.log(userId)

    const listing =  await RentalItem.find({
        _id :id
    })

    if(!listing) {
      return res.status(STATUS.FORBIDDEN).json({
        Success: BOOLEAN.FALSE,
        message: REVIEWS.REVIEW_LISTING_NOT_FOUND
    })

    }

    const CheckAggreement = await Aggrement.findOne({
        listingId: id,
        renterId: userId,
        $or: [
          { agreementStatus: "active" },
          { agreementStatus: "Inactive" }
        ]
    });

    if (!CheckAggreement) {
      return res.status(STATUS.FORBIDDEN).json({
        Success: BOOLEAN.FALSE,
        message: AGGREEMENT.RENTED_AGGREEMENT
    })
    }

    const existingReview = await listingReview.findOne({
      listing: id,
      reviewer: userId
    });

    if (existingReview) {
      return res.status(STATUS.FORBIDDEN).json({
        Success: BOOLEAN.FALSE,
        message: REVIEWS.REVIEW_ALREADY_EXISTS_LISTING
    })
    }
    
    const ListingReview = await listingReview.create({
      listing: id,
      rating: rating,
      comment: comment,
      reviewer: userId,
      createdAt: Date.now(),
    });

    // const Listing = await RentalItem.findByIdAndUpdate(
    //   id,
    //   { $push: { listingReviews: ListingReview._id } },
    //   { new: true }
    // );

    // if (!Listing) {
    //   return next(new AppError("Rental item not found", 404));
    // }

    res.status(STATUS.SUCCESS).json({
      status: BOOLEAN.TRUE,
      data: {
          message: REVIEWS.REVIEW_REPORTED,
          review: ListingReview,
          // list: Listing,
      },
  });
   
  } catch (error) {
    next(error);
  }
};

exports.getAllReviewsForRentalItem = async (req, res, next) => {
  try {
    const { id } = req.params


    const ListingReview  = await  listingReview.find({listing:id }).populate("reviewer")

    if (!ListingReview) {
      return res.status(STATUS.FORBIDDEN).json({
        Success: BOOLEAN.FALSE,
        message: REVIEWS.REVIEW_LISTING_NOT_FOUND
    })
    }
    res.status(STATUS.SUCCESS).json({
      status: BOOLEAN.TRUE,
      data: {
          message: REVIEWS.REVIEW_FETCHED,
          reviews: ListingReview,
      },
  });
  } catch (error) {
    next(error);
  }
};