const Aggrement = require("../../model/agreements/Aggrement");
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const logger = require("../../utils/logger");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE,  } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const { GetAndDecodeToken } = require("../../token/Tokens");
const bcrypt = require('bcrypt')
const AppError = require("../../utils/AppError");
const { BOOLEAN } = require("../../utils/Roles");
const QRCode = require('qrcode')
const { io } = require("../../utils/socket");

const CreateQrCode = async (data) =>{
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

exports.CreateAggrement = async (req, res ,  next) => {
    try {
        const {listingId ,renterId ,aggrementDetail , ownerConfirmed }  = req.body;
        const ownerId = req.user._id; 
        

        if(!renterId)
        {
            console.log("renter id not found")
            return;
        }

        console.log(req.body);
        console.log(ownerId);
        if(!ownerId){
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
        }

        const aggrementDetails = new AggrementDetails({
            aggrementDetail: aggrementDetail
        })
        await aggrementDetails.save();
        console.log(aggrementDetails);

console.log(aggrementDetails._id);
        const agg = new Aggrement({
            listingId: listingId,
            ownerId: ownerId,
            renterId: renterId,
            agreementStatus: "pending",
            ownerConfirmed: ownerConfirmed || false,
            renterConfirmed: false,
            agreementDetailsId: aggrementDetails._id,  
        
        })

        const qrCode = await CreateQrCode(agg._id);
        agg.qrId = qrCode;
        
        await agg.save();
        res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: RESPONCE_MESSAGE.AGGREGEMENT_CREATED,
            data: aggrement
        })

        
    } catch (error) {
        next(error);
        
    }
}


exports.verifyAggrement = async (req, res, next) => {
    try {
        const { aggId } = req.params;
        const agg = await Aggrement.findById(aggId);
        if(!agg){
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
        }
        const {renterConfirmed } = req.body;
        if(renterConfirmed == BOOLEAN.TRUE){
            agg.renterConfirmed = renterConfirmed;
            await agg.save();
        }
        
      
    } catch (error) {
        next(error);
    }
}

exports.sentAggreement = async (req, res, next) => {
    try {
        const { aggId , conversationId} = req.body;
        const agg = await Aggrement.findById(aggId);
        if(!agg){
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
        }
        const aggDetails = await AggrementDetails.findById(agg.agreementDetailsId);
        if(!aggDetails){
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
        }
        if(io){
            io.to(conversationId.toString()).emit("receiveMessage", {
            message:"aggrement for Renter confirmation",
                status: "sent",
                value : `${process.env.CLIENT_URL}/aggrement/${agg._id}`
            });
        }
      
        
    }catch (error) {
        next(error);
    }
}


exports.GetAggrementByQr = async(req, res, next)=>{}


