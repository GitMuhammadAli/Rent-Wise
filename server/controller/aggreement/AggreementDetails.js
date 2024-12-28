const Aggrement = require("../../model/agreements/Aggrement");
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const RentalItem = require("../../model/listings/RentalItemModel");
const logger = require("../../utils/logger");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE, AGGREEMENT } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const { GetAndDecodeToken } = require("../../token/Tokens");
const bcrypt = require('bcrypt')
const AppError = require("../../utils/AppError");
const { BOOLEAN } = require("../../utils/Roles");
const QRCode = require('qrcode')
const { io } = require("../../utils/socket");
const Messsage = require("../../model/chat/MesssageModel");
const Conversation = require("../../model/chat/ConversationModel");

const CreateQrCode = async (data) => {
    try {
        const QrData = JSON.stringify(data);
        console.log("data for qr is" + QrData)
        console.log(typeof QrData)
        const qrCode = await QRCode.toDataURL(QrData);
        return qrCode;
    } catch (error) {
        logger.error(error);
        throw new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.QR_ERROR, STATUS.INTERNAL_SERVER_ERROR);
    }
}

exports.getByOwnerId = async (req, res, next) => {

    try {

        const ownerId = req.user._id;
        const agg = await Aggrement.find({ ownerId }).populate("listingId").populate("renterId");
        if (!agg) {
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: RESPONCE_MESSAGE.AGGREGEMENT_CREATED,
            data: agg,
        })
    } catch (error) {
        next(error);

    }

}

exports.CreateAggrement = async (req, res, next) => {
    try {
        const { listingId, renterId, aggrementDetail, ownerConfirmed, conversationID } = req.body;
        const ownerId = req.user._id;

        console.log(req.body);
        if (!ownerId) {
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
        }

        if (!listingId || !renterId || !aggrementDetail) {
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.MISSING_FIELDS, STATUS.BAD_REQUEST));
        }

        const listing = await RentalItem.findById(listingId);
        console.log("listing is: ", listing);
        if (!listing) {
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.LISTING_NOT_FOUND, STATUS.NOT_FOUND));
        }

        if (listing.owner.toString() !== ownerId.toString()) {
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.NOT_LISTING_OWNER, STATUS.UNAUTHORIZED));
        }

        if (renterId.toString() === ownerId.toString()) {
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.OwneAggrement, STATUS.BAD_REQUEST));
        }

        const existingAgreement = await Aggrement.findOne({
            listingId: listingId,
            renterId: renterId,
            $or: [{ agreementStatus: "pending" }, { agreementStatus: "active" }]
        });

        console.log("existingAgreement:", existingAgreement);

        if (existingAgreement) {
            return res.status(STATUS.FORBIDDEN).json({
                status: STATUS.FORBIDDEN,
                message: AGGREEMENT.AGGREMENT_ALREADY_EXISTS
            });
        }
        const aggrementDetails = new AggrementDetails({
            aggrementDetail: aggrementDetail
        })
        await aggrementDetails.save();

        const agg = new Aggrement({
            listingId: listingId,
            ownerId: ownerId,
            renterId: renterId,
            conversationID: conversationID,
            agreementStatus: "pending",
            ownerConfirmed: ownerConfirmed || false,
            renterConfirmed: false,
            agreementDetailsId: aggrementDetails._id,
        })

        const qrCode = await CreateQrCode(agg._id);
        agg.qrId = qrCode;

        await agg.save();
        console.log("agg is: ", agg);
        res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: RESPONCE_MESSAGE.AGGREGEMENT_CREATED,
            data: agg,
        })
    } catch (error) {
        next(error);
    }
}

exports.verifyAggrement = async (req, res, next) => {
    try {
        const { aggId } = req.params;
        const agg = await Aggrement.findById(aggId);
        if (!agg) {
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
        }
        const { renterConfirmed } = req.body;
        if (renterConfirmed == BOOLEAN.TRUE) {
            agg.renterConfirmed = renterConfirmed;
            await agg.save();
        }
    } catch (error) {
        next(error);
    }
}



exports.createLinkMessage = async (listingId, message, senderId, receiver, conversationID, isLinkMessage) => {
    try {
        const conversation = await Conversation.findById(conversationID);
        if (!conversation) {
            throw new Error("Conversation not found");
        }

        const newMessage = new Messsage({
            sender: senderId,
            receiver,
            conversation: conversationID,
            listing: listingId,
            message,
            status: "sent",
            type: "link",
        });

        await newMessage.save();

        conversation.updatedAt = new Date();
        await conversation.save();

        return newMessage; // Ensure this value is returned
    } catch (err) {
        console.error("Error in createLinkMessage:", err);
        throw err;
    }
};


exports.sentAggreement = async (req, res, next) => {
    try {
        const { aggrementFromResponce } = req.body;
        if (!aggrementFromResponce) {
            return next(new AppError(false, "Request body does not contain aggrementFromResponce", 400));
        }
        const { _id, conversationID, renterId, ownerId, listingId } = aggrementFromResponce;
        console.log("Request body:", req.body);
        console.log("id:", _id);

        const agg = await Aggrement.findById(_id);
        if (!agg) {
            return next(new AppError(false, "Agreement not found", 404));
        }

        const aggDetails = await AggrementDetails.findById(agg.agreementDetailsId);
        if (!aggDetails) {
            return next(new AppError(false, "Agreement details not found", 404));
        }

        const messageLink = await exports.createLinkMessage(
            agg.listingId,
            ` Agreement for renter confirmation ${process.env.CLIENT_URL}/aggrement/${agg._id}`,
            agg.ownerId,
            agg.renterId,
            conversationID,
            true
        );

        if (io) {
            console.log("sending message to conversationID:", conversationID);

            io.to(conversationID.toString()).emit("receiveMessage",
                {
                    conversationID,
                    message: ` Agreement for renter confirmation ${process.env.CLIENT_URL}/aggrement/${agg._id}`,
                    sender: ownerId,
                    receiver: renterId,
                    listing: listingId,
                });
        }

        res.status(200).json({
            success: true,
            message: "Agreement notification sent successfully",
            data: messageLink,
        });
    } catch (error) {
        console.error("Error in sentAggreement:", error);
        next(error);
    }
};




exports.GetAggrementByQr = async (req, res, next) => { }


exports.GetByAggrementId = async (req, res, next) => {
    try {
        const { aggId } = req.body;
        console.log(req.body);
        console.log("aggrID", aggId);

        const agg = await Aggrement.findById(aggId).populate('agreementDetailsId').populate("renterId").populate("listingId").populate("ownerId");

        if (!agg) {
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.AGGREMENT_NOT_FOUND, STATUS.NOT_FOUND));
        }
        res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: AGGREEMENT.AGGREMENT_FECTHED_BY_ID,
            data: agg,
        })
    } catch (error) {
        next(error);
    }
}