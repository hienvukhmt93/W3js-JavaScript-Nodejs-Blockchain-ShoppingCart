var Address = require('../models/address');
var Config = require('../contract/Config');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping');

var address = [
  new Address({
        email: 'address1@gmail.com',
        address: Config.address1
  }),
  new Address({
    email: 'address2@gmail.com',
    address: Config.address2
    }),
    new Address({
        email: 'address3@gmail.com',
        address: Config.address3
    }),
    new Address({
        email: 'address4@gmail.com',
        address: Config.address4
    }),
    new Address({
        email: 'address5@gmail.com',
        address: Config.address5
    })
];
var done = 0;
for(var i = 0; i < address.length; i++) {
    address[i].save(function(err, result) {
        done++;
        if(done == address.length) {
            mongoose.disconnect();
            console.log('Sucs');
        }
    });
}
