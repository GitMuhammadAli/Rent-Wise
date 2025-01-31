const Aggrement = require("../../model/agreements/Aggrement");
const AggrementDetails = require("../../model/agreements/AggrementDetails");
const RentalItem = require("../../model/listings/RentalItemModel");
const listingReview = require("../../model/reviews/listingReview");
const Notification = require("../../model/notification/notification")
const { ERROR_MESSAGE } = require("../../messages/error");
const {
  RESPONCE_MESSAGE,
  AGGREEMENT,
  CONVERSATION,
  REVIEWS,
  NOTIFICATION,
} = require("../../messages/response");
const { STATUS } = require("../../messages/status");
const AppError = require("../../utils/AppError");
const { ROLES, BOOLEAN } = require("../../utils/Roles");
const QRCode = require("qrcode");
const { io } = require("../../utils/socket");
const Messsage = require("../../model/chat/MesssageModel");
const Conversation = require("../../model/chat/ConversationModel");
const {CreateNotification} = require("../../controller/notification/notification")


const cron = require('node-cron');


const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);



cron.schedule('0 0 * * *', async () => {
  try {
    const expiringAgreements = await Aggrement.aggregate([
        {
          $lookup: {
            from: "aggrementdetails",
            localField: "agreementDetailsId",
            foreignField: "_id",
            as: "details"
          }
        },
        {
          $unwind: "$details"
        },
        {
          $match: {
            "details.aggrementDetail.endDate": {
              $lte: threeDaysFromNow,
              $gte: new Date() // Ensure end date is in the future
            },
            agreementStatus: "active" // Only active agreements
          }
        },
        {
          $project: {
            ownerId: 1,
            renterId: 1,
            endDate: "$details.aggrementDetail.endDate",
            listingId: 1
          }
        }
      ]);
      
    
    expiringAgreements.forEach(async (agreement) => {
      const daysLeft = Math.ceil((agreement.endDate - Date.now()) / (1000 * 60 * 60 * 24));
      
      // Notify owner
      await CreateNotification(
        agreement.ownerId,
        null, // System as sender
        "aggrement",
        `Agreement for listing ${agreement.listingId} expires in ${daysLeft} days`,
        next
      );

      // Notify renter
      await CreateNotification(
        agreement.renterId,
        null,
        "aggrement",
        `Your rental agreement expires in ${daysLeft} days`,
        next
      );
    });
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

