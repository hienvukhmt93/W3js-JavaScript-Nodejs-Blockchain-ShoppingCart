var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var buyListSchema  = new Schema({
    email: {type: String, required: true},
    id: {type: String, required: true},
    name: {type: String, required: true},
    prices : {type: Number, required: true},
    description: {type: String, required: true},
    hashCode: {type: String, required: true},
    number: {type: Number, required: true},
    transactionHash: {type: String, required:true}
}); 

module.exports = mongoose.model('buyList', buyListSchema);