var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rechargeSchema = new Schema({
    email: {type: String, required: true},
    amount: {type: Number, required: true},
    from: {type: String, required: true},
    transactionHash:{type: String, required: true}
});

module.exports = mongoose.model('recharge', rechargeSchema);