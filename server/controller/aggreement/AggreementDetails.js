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

        if (existingAgreement) {

            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.AGGREMENT_ALREADY_EXISTS, STATUS.BAD_REQUEST));
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



const createLinkMessage = async (listingId, message, senderId, receiver, conversationID, isLinkMessage) => {

    // listingId: new ObjectId('674ee57c03100829c478d4f8'),
    // ownerId: new ObjectId('670e21628426323ce4847a99'),
    // renterId: new ObjectId('670ae3d75c58ad616e636e56'),
    // agreementStatus: 'pending',
    // conversationID: new ObjectId('67586d93a124c904c38c91be'),
    // ownerConfirmed: false,
    // renterConfirmed: false,
    // agreementDetailsId: new ObjectId('677006e14332d87dc452776e'),
    // _id: new ObjectId('677006e14332d87dc4527770'),
    // agreementDate: 2024-12-28T14:10:41.839Z,


    try {
        const conversation = await Conversation.findById(conversationID);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const newMessage = new Messsage({
            sender: senderId,
            receiver: receiver,
            conversation: conversationID,
            listing: listingId,
            message,
            status: 'sent',
            type: isLinkMessage ? 'link' : 'text',
        });

        await newMessage.save();

        conversation.updatedAt = new Date();
        await conversation.save();

        if (io) {
            io.to(conversationID.toString()).emit("receiveMessage", {
                conversationID,
                message,
                sender: senderId,
                receiver,
                listing: listingArray,
            });
        }

        res.status(201).json({ success: BOOLEAN.TRUE, message: "Message sent successfully", data: newMessage });
    } catch (err) {
        console.log(err);

    }
}






exports.sentAggreement = async (req, res, next) => {
    try {
        const { _id, conversationID, agreementDetailsId } = req.body;
        console.log("Request body:", req.body);

        const agg = await Aggrement.findById(_id);
        if (!agg) {
            return next(new AppError(false, "Agreement not found", 404));
        }

        const aggDetails = await AggrementDetails.findById(agg.agreementDetailsId);
        if (!aggDetails) {
            return next(new AppError(false, "Agreement details not found", 404));
        }

        if (io) {
            io.to(conversationID.toString()).emit("receiveMessage", {
                message: "Agreement for renter confirmation",
                status: "sent",
                value: `${process.env.CLIENT_URL}/aggrement/${agg._id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Agreement notification sent successfully",
        });
    } catch (error) {
        next(error);
    }
};


exports.GetAggrementByQr = async (req, res, next) => { }


exports.GetByAggrementId = async (req, res, next) => {
    try {
        const { aggId } = req.body;
        console.log(req.body);
        console.log("aggrID", aggId);
        
        const agg = await Aggrement.findById(aggId).populate({
            path: "agreementDetailsId",
            model: "AggrementDetails",
        }).populate("renterId");

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