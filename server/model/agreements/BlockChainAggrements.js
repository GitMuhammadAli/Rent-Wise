const mongoose = require("mongoose");


const BlockChainAggrementSchema = new mongoose.Schema({
    AggrementId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aggrement",
        required: true,
    },
    BlockChainstatus:{
        enum:["pending", "accepted", "rejected" , "active"],
        type:String,
        required:true,
        default:"pending"
    },
    transactionHash:{
        type: mongoose.Schema.Types.Mixed,
        required:true,
    },
});



const BlockChainAggrement = mongoose.model("BlockChainAggrement", BlockChainAggrementSchema);

module.exports = BlockChainAggrement;