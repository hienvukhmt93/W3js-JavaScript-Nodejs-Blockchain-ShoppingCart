var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    prices : {type: Number, required: true},
    description: {type: String, required: true},
    detail : {type:String, required : true},
    hashCode: {type: String, required: true},
    number: {type: Number, required: true},
    address: {type: String, required: true}
}); 

module.exports = mongoose.model('Product', schema);