const Aggrement = require("../../../model/agreements/Aggrement");
const AggrementDetails = require("../../../model/agreements/AggrementDetails");
const RentalItem = require("../../../model/listings/RentalItemModel");
const BlockChainAggrement = require("../../../model/agreements/BlockChainAggrements");
const User = require("../../../model/user/userModel")
const logger = require("../../../utils/logger");
const { ERROR_MESSAGE } = require("../../../messages/error");
const {
    RESPONCE_MESSAGE,
    AGGREEMENT,
    CONVERSATION,
} = require("../../../messages/response");
const { STATUS } = require("../../../messages/status");
const AppError = require("../../../utils/AppError");
const { ROLES, BOOLEAN } = require("../../../utils/Roles");
const QRCode = require("qrcode");
const { io } = require("../../../utils/socket");
const Messsage = require("../../../model/chat/MesssageModel");
const Conversation = require("../../../model/chat/ConversationModel");
const { CreateNotification } = require("../../notification/notification")



exports.getUserListings = async (req, res, next) => {
    try {

    } catch (error) {

    }
}