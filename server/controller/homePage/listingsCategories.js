const Aggrement = require("../../model/agreements/Aggrement");
const listings = require("../../model/listings/RentalItemModel")
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const RentalItem = require("../../model/listings/RentalItemModel");
const { ERROR_MESSAGE } = require("../../messages/error");
const { RESPONCE_MESSAGE, AGGREEMENT, CONVERSATION ,LISTINGS } = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const AppError = require("../../utils/AppError");
const { ROLES, BOOLEAN } = require("../../utils/Roles");
const QRCode = require('qrcode')
const { io } = require("../../utils/socket");
const Messsage = require("../../model/chat/MesssageModel");
const Conversation = require("../../model/chat/ConversationModel");



exports.getAllCarsListings = async (req, res, next) => {
    try {
        const CarListings = await listings.find({
            category:"car"
        })

        res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: LISTINGS.CAR_LISTING_FETCHED,
            data: CarListings,
        })

    } catch (error) {
        next(error)

    }
}
exports.getAllHouseListings = async (req, res, next) => {
    try {
        const HouseListings = await listings.find({
            category:"house"
        })

        res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: LISTINGS.HOUSE_LISTING_FETCHED,
            data: HouseListings,
        })

    } catch (error) {
        next(error)


    }
}
exports.getAllApartmentsListings = async (req, res, next) => {
    try {

        const ApartmentListings = await listings.find({
            category:"apartment"
        })

        res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: LISTINGS.APARTMENTS_LISTING_FETCHED,
            data: ApartmentListings,
        })
    } catch (error) {
        next(error)


    }
}