var Address = require('../models/address');
var Config = require('../contract/Config');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping');
var BuyList =  require('../models/buyList');
var buylist = new BuyList( {
    email: 'hien' ,
    id: 'vu',
    name: 'van',
    transactionHash:'1' ,
    number: 10,
    linkRopsten: '123'
});
buylist.save() ;