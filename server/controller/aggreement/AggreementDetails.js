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

const CreateQrCode = async (data) =>{
    try {
        const qrCode = await QRCode.toDataURL(data);
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

        if(!!ownerId){
            return next(new AppError(BOOLEAN.FALSE, ERROR_MESSAGE.USER_NOT_FOUND, STATUS.NOT_FOUND));
        }

        const aggrementDetails = new AggrementDetails({
            aggrementDetail: aggrementDetail
        })
        await aggrementDetails.save();


        const agg = new Aggrement({
            listingId: listingId,
            owner: ownerId,
            renterId: renterId,
            agreementStatus: "pending",
            ownerConfirmed: ownerConfirmed || false,
            renterConfirmed: false,
            agreementDetailsId: aggrementDetails._id,  
        
        })

        const qrCode = await CreateQrCode(agg._id);
        const aggrement = await agg({
            qrId: qrCode
        })
        
        await aggrement.save();
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
        
      
    } catch (error) {
        next(error);
    }
}



exports.GetAggrementByQr = async(req, res, next)=>{}


