var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var signSchema = new Schema({
    hasIMG: { type: String, required: true},
    hashMessage: {type: String, required: true},
    v: { type: Number, required: true},
    r: { type: String, required: true},
    s: { type: String, required: true}
});
module.exports = mongoose.model('Sign', signSchema);