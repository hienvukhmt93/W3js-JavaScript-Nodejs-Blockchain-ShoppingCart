var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
    email : {type: String, required: true},
    address: {type: String, required: true},
}); 

module.exports = mongoose.model('Address', addressSchema);