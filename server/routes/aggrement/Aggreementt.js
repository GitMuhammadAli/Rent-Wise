const router = require("express").Router();
const asyncHandler = require('../../middleware/asyncWrapper');
const Aggreement = require("../../controller/aggreement/AggreementDetails")
const { AuthorizeUser } = require("../../middleware/auth");

router.post('/createAggreement', AuthorizeUser("user", "admin"), asyncHandler(Aggreement.CreateAggrement));

router.post("/sentaggreement", AuthorizeUser("user", "admin"), asyncHandler(Aggreement.sentAggreement));

router.get("/GetByOwnerId", AuthorizeUser("user", "admin"), asyncHandler(Aggreement.getByOwnerId));

router.get("/getAggrementDetails", AuthorizeUser("user", "admin"), asyncHandler(Aggreement.GetByAggrementId));


module.exports = router;