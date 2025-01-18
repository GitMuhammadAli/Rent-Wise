const express = require("express");
const router = express.Router();
const { AuthorizeUser, FindUser } = require("../../middleware/auth");
const  asyncHandler = require('../../middleware/asyncWrapper');
const blockchain = require("../../controller/aggreement/BlockChain");



router.get("/admin/allAggremments", AuthorizeUser("admin"), asyncHandler(blockchain.getAggrementForAdminByOwnerIDs));



module.exports = router;