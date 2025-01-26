const Aggrement = require("../../model/agreements/Aggrement");
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const User = require("../../model/user/userModel")
const profileReview = require("../../model/reviews/profileReview");
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
const { io } = require("../../utils/socket");

exports.CreateUserReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;


        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(STATUS.FORBIDDEN).json({
                Success: BOOLEAN.FALSE,
                message: REVIEWS.REVIEW_USER_NOT_FOUND
            })
        }

        const CheckAggreement = await Aggrement.find({
            ownerId: id,
            renterId: userId,
            $or: [{ agreementStatus: "active" }, { agreementStatus: "Inactive" }],
        });

        if (!CheckAggreement) {
            return res.status(STATUS.FORBIDDEN).json({
                Success: BOOLEAN.FALSE,
                message: AGGREEMENT.RENTED_AGGREEMENT
            })
        }

        const existingReview = await profileReview.findOne({ reviewedUser: id, reviewer: userId });

        if (existingReview) {
            return res.status(STATUS.FORBIDDEN).json({
                Success: BOOLEAN.FALSE,
                message: REVIEWS.REVIEW_ALREADY_EXISTS_USER
            })
        }

        const userprofileReview = await profileReview.create({
            reviewedUser: id,
            reviewer: userId,
            rating: rating,
            comment: comment,
            createdAt: Date.now(),
        });


        if (!userprofileReview) {
            return next(new AppError(BOOLEAN.FALSE, REVIEWS.NOT_CREATED, STATUS.NOT_FOUND))
        }

        // const updateResult = await User.findByIdAndUpdate(
        //     id,
        //     {
        //         $push: {
        //             userReview: {
        //                 reviewId: userprofileReview._id,
        //                 canReview: true,
        //             },
        //         },
        //     },
        //     { new: true }
        // );

        // console.log("User Update Result:", updateResult);

        // if (!updateResult) {
        //     console.error("Failed to update user review.");
        // }
        res.status(STATUS.SUCCESS).json({
            status: BOOLEAN.TRUE,
            data: {
                message: REVIEWS.REVIEW_REPORTED,
                review: userprofileReview,
                // user: updateResult,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllReviewsForUsers = async (req, res, next) => {
    try {
        const { id } = req.params


        const ProfileReview = await profileReview.find({ reviewedUser: id })

        if (!ProfileReview) {
            return next(new AppError("Rental item not found", 404));
        }

        res.status(STATUS.SUCCESS).json({
            status: BOOLEAN.TRUE,
            data: {
                message: REVIEWS.REVIEW_FETCHED,
                reviews: ProfileReview,
            },
        });

    } catch (error) {
        next(error);
    }
};