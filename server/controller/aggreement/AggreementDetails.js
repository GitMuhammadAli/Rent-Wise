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

const CreateQrCode = async (data) =>{}

exports.CreateAggrement = async (req, res ,  next) => {
    try {
        const {}  = req.body;
        
    } catch (error) {
        
    }
}





exports.GetAggrementByQr = async(req, res, next)=>{}


