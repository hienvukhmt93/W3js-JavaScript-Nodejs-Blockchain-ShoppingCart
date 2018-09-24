var express = require('express');
var router = express.Router();
var passport = require('passport');
const Transaction = require('../contract/Transaction');
const Config = require('../contract/Config');
const _ 					= require('lodash');
const ethWallet 			= require('ethereumjs-wallet');
const ethUtil 				= require('ethereumjs-util');
const Tx 					= require('ethereumjs-tx');
const Web3 					= require('web3');
const mongoose = require('mongoose');
// const SolFunction 			= require('web3/lib/web3/function');
const ExpressFunction       = require('../contract/ExpressFunction');
const  web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Z4It2Ma8e6CaZDeRH2HB'));
const abiContract = new web3.eth.Contract(Config.abi);
const User  = require('../models/user');
const BuyList = require('../models/buyList');
const Recharge = require('../models/recharge');

var Product = require('../models/products');
var Address = require('../models/address');
var Cart = require('../models/cart');

const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
const dir = '/home/hienvu/Desktop/Data-IMG/upload/';
const Sign = require('../models/sign');

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');


router.get('/recharge-to-account', isLogin, function(req, res, next) {
    res.render('admin/recharge-to-account');
  });
router.post('/recharge-to-account', isLogin, function(req, res, next) {
    var amount = req.body.amount; 
    var privateKey = req.body.privateKey;
    var email = req.body.email;
    var acc_address = req.session.address;
    var wallet =  ethWallet.fromPrivateKey(new Buffer.from(privateKey,'hex'));
    var acc_privateKey =  wallet.getAddressString();
    if(acc_address == acc_privateKey) {
        User.findOne({'email' : email}, function(err, result) {
            if(result == undefined) {
                res.send({mes: "Email is invalid"});
            } else {
                Transaction.approve(email, Config.address5, parseInt(amount), req.session.address, privateKey,Config.contractAdress, 
                (hash) =>{
                    console.log(hash);
                    var recharge = new Recharge({
                        email: email,
                        amount: parseInt(amount),
                        from:  req.session.address,
                        transactionHash: hash
                    });
                    console.log(recharge);
                    recharge.save(function(err, result) {
                        console.log(err);
                    });
                }, (receipt) => {
                    console.log(receipt);
                } );
                res.send({status: true});
            }
        });

    } else {
        res.send({mes: "Private key not correct"});
    }
 
});

router.get('/set-balances', isLogin, function(req, res, next) {
    // console.log("Hic Hic");
    Recharge.find(function(err, result) {
        // console.log("Data", result);
        res.render('admin/set-balances',{data: result});
    });
});

router.post('/set-balances', isLogin, function(req, res, next) {
    var _id = req.body._id;
    var email = req.body.email;
    var privateKey = req.body.privateKey;
    var amount = req.body.amount;

    console.log(email, privateKey, amount, _id);
    var acc_add = req.session.address;
    var wallet =  ethWallet.fromPrivateKey(new Buffer.from(privateKey,'hex'));
    var acc_privateKey =  wallet.getAddressString();
    console.log(acc_add == acc_privateKey);
    if(acc_add == acc_privateKey) {
        Transaction.setBalances(Config.address5, email, req.session.address, Config.contractAdress, privateKey, 
        (hash) =>{
                console.log(hash);
        }, (receipt) => {
            console.log(receipt);
        });
        Recharge.deleteOne({_id: _id}, function(err, result) {
            // console.log("hihih");
        });
        User.findOne({'email': email}, function(err, result) {
            User.updateOne({'email': email}, {$set: {balances: result.balances + parseInt(amount)}}, function(err, result) {
                console.log("105-Update Ok");
            });
        });

        User.findOne({'email': req.session.email}, function(err, result) {
            User.updateOne({'email': req.session.email}, {$set: {balances: result.balances + parseInt(amount)}}, function(err, result) {
                console.log("109-Update Ok");
            });
        });
        res.send({status: true});
    } else {
        res.send({mes: "Private key not correct"});
    }


});

router.get('/home-admin',isLogin, function(req, res, next) {
    var email = req.session.email;
    Product.find({'address': req.session.address}, function(err, data) {
        if(!err) {
            res.render('shop/home-admin', {data: data});
            // console.log(data);
        }
    });
})
router.get('/direct-edit/:id', isLogin, function(req, res, next) {
    var id = req.params.id;
    Product.findById(id, function(err, result) {
            res.render('shop/direct-edit',{data: result});
    });

});

router.post('/direct-edit', isLogin, function(req, res, next) {
    var data = JSON.parse(req.body.data);
    console.log("ID", data.id);
    // console.log("142", JSON.parse(req.body.data));
    var file = req.files.myFile;
    var filename = file.name;
    var acc_add = req.session.address;
    var wallet =  ethWallet.fromPrivateKey(new Buffer.from(data.privateKey,'hex'));
    var acc_privateKey =  wallet.getAddressString();
    console.log(acc_add == acc_privateKey);
    if(acc_add ==  acc_privateKey) {

        fs.exists("/home/hienvu/Desktop/EJS/public/images/"+ filename, (exists) => {
            if(exists) {
                console.log("Exits");
            var testFile = fs.readFileSync("/home/hienvu/Desktop/EJS/public/images/" + filename);
            var testBuffer = new Buffer(testFile);
            ipfs.files.add(testBuffer, function (err, file) {
                  if(file) {
                    var myquery = { _id: data.id };
                    var newvalues = { $set: 
                        {   
                            name: data.name,
                            prices: parseInt(data.prices),
                            description: data.description,
                            detail: data.detail,
                            hashCode: file[0].hash,
                            number: parseInt(data.number),
                            address: req.session.address 
                        }
                    };
                    // console.log(file[0]);
                    // console.log("Im test", test);
                    var sign = web3.eth.accounts.sign(Transaction.toSha3(file[0].hash), '0x' + data.privateKey,{from: req.session.address});
                    // console.log(sign);
                    var img_sign = new Sign({
                        hasIMG: file[0].hash,
                        hashMessage: sign.messageHash ,
                        v: sign.v,
                        r: sign.r,
                        s: sign.s
                    });
                    // console.log(img_sign);
                    img_sign.save(function(err, result) {
                    });
                    var done1 = 0;
                    Transaction.signIMG( Transaction.toSha3(file[0].hash),sign.v, sign.r, sign.s, req.session.address, Config.contractAdress, data.privateKey, (hash) => {
                        console.log(hash);
                    }, (receipt) => {
                        console.log(receipt);
                    });
                    Product.updateOne(myquery, newvalues,function(err, result) {
                        done1++;
                        console.log(done1); 
                    res.send({status: true});  
                  });
                  }
            });
            
 
            } else {
                console.log("Not exists");
            file.mv("/home/hienvu/Desktop/EJS/public/images/"+ filename, function(err) {

                var testFile = fs.readFileSync("/home/hienvu/Desktop/EJS/public/images/" + filename);
                var testBuffer = new Buffer(testFile);
                ipfs.files.add(testBuffer, function (err, file) {
                      if(file) {
                        var myquery = { _id: data.id };
                        var newvalues = { $set: 
                            {   
                                name: data.name,
                                prices: parseInt(data.prices),
                                description: data.description,
                                detail: data.detail,
                                hashCode: file[0].hash,
                                number: parseInt(data.number),
                                address: req.session.address 
                            }
                        };
                        // console.log(file[0]);
                        // console.log("Im test", test);
                        var sign = web3.eth.accounts.sign(Transaction.toSha3(file[0].hash), '0x' + data.privateKey,{from: req.session.address});
                        // console.log(sign);
                        var img_sign = new Sign({
                            hasIMG: file[0].hash,
                            hashMessage: sign.messageHash ,
                            v: sign.v,
                            r: sign.r,
                            s: sign.s
                        });
                        // console.log(img_sign);
                        img_sign.save(function(err, result) {
                        });
                        var done1 = 0;
                        Transaction.signIMG( Transaction.toSha3(file[0].hash),sign.v, sign.r, sign.s, req.session.address, Config.contractAdress, data.privateKey, (hash) => {
                            console.log(hash);
                        }, (receipt) => {
                            console.log(receipt);
                        });
                        Product.updateOne(myquery, newvalues,function(err, result) {
                            done1++;
                            console.log(done1);
                        res.send({status: true});    
                      });
                      }
                });

            });

            }
         });

    } else {
        res.send({mes: "Private key not correct"});
    }

});

router.get('/direct-add-item', function(req, res, next) {
    res.render('shop/direct-add-item');
});

router.post('/direct-add-item', function(req, res, next) {
    var data = JSON.parse(req.body.data);
    console.log("ID", data.id);
    // console.log("142", JSON.parse(req.body.data));
    var file = req.files.myFile;
    var filename = file.name;
    var acc_add = req.session.address;
    var wallet =  ethWallet.fromPrivateKey(new Buffer.from(data.privateKey,'hex'));
    var acc_privateKey =  wallet.getAddressString();
    console.log(acc_add == acc_privateKey);
    if(acc_add ==  acc_privateKey) {

        fs.exists("/home/hienvu/Desktop/EJS/public/images/"+ filename, (exists) => {
            if(exists) {
                console.log("Exits");
            var testFile = fs.readFileSync("/home/hienvu/Desktop/EJS/public/images/" + filename);
            var testBuffer = new Buffer(testFile);
            ipfs.files.add(testBuffer, function (err, file) {
                  if(file) {
                    var newvalues = new Product(
                        {   
                            name: data.name,
                            prices: parseInt(data.prices),
                            description: data.description,
                            detail: data.detail,
                            hashCode: file[0].hash,
                            number: parseInt(data.number),
                            address: req.session.address 
                        }
                    );

                    var sign = web3.eth.accounts.sign(Transaction.toSha3(file[0].hash), '0x' + data.privateKey,{from: req.session.address});
                    var img_sign = new Sign({
                        hasIMG: file[0].hash,
                        hashMessage: sign.messageHash ,
                        v: sign.v,
                        r: sign.r,
                        s: sign.s
                    });
                    img_sign.save(function(err, result) {
                    });
                    var done1 = 0;
                    Transaction.signIMG( Transaction.toSha3(file[0].hash),sign.v, sign.r, sign.s, req.session.address, Config.contractAdress, data.privateKey, (hash) => {
                        console.log(hash);
                    }, (receipt) => {
                        console.log(receipt);
                    });
                    newvalues.save(function(err, result) {
                        done1++;
                        console.log(done1); 
                    res.send({status: true});  
                  });
                  }
            });
            
 
            } else {
                console.log("Not exists");
            file.mv("/home/hienvu/Desktop/EJS/public/images/"+ filename, function(err) {

                var testFile = fs.readFileSync("/home/hienvu/Desktop/EJS/public/images/" + filename);
                var testBuffer = new Buffer(testFile);
                ipfs.files.add(testBuffer, function (err, file) {
                      if(file) {
                        var newvalues = new Product(
                            {   
                                name: data.name,
                                prices: parseInt(data.prices),
                                description: data.description,
                                detail: data.detail,
                                hashCode: file[0].hash,
                                number: parseInt(data.number),
                                address: req.session.address 
                            }
                        );
                        var sign = web3.eth.accounts.sign(Transaction.toSha3(file[0].hash), '0x' + data.privateKey,{from: req.session.address});
                        var img_sign = new Sign({
                            hasIMG: file[0].hash,
                            hashMessage: sign.messageHash ,
                            v: sign.v,
                            r: sign.r,
                            s: sign.s
                        });
                        img_sign.save(function(err, result) {
                        });
                        var done1 = 0;
                        Transaction.signIMG( Transaction.toSha3(file[0].hash),sign.v, sign.r, sign.s, req.session.address, Config.contractAdress, data.privateKey, (hash) => {
                            console.log(hash);
                        }, (receipt) => {
                            console.log(receipt);
                        });
                        newvalues.save(function(err, result) {
                            done1++;
                            console.log(done1); 
                        res.send({status: true});  
                      });
                      }
                });

            });

            }
         });

    } else {
        res.send({mes: "Private key not correct"});
    }
});





module.exports = router;

function isLogin(req, res, next) {
    if( req.isAuthenticated()) {
        return next();
    }
    else{
        res.redirect('/user/signin');
    }
  
  }