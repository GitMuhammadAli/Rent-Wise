const mongoose = require('mongoose');

const AggrementDetailsSchema = new mongoose.Schema({
    aggrementDetail: {
        type: mongoose.Schema.type.mixed,
        required: true
    }
}, {
    timestamps: true
});



const AggrementDetails = mongoose.model('AggrementDetails', AggrementDetailsSchema);
module.exports = AggrementDetails;