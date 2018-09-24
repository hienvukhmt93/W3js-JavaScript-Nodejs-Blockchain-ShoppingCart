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

/* GET home page. */

router.get('/signup', function(req, res, next) {
    var cart = [];
    req.session.cart = cart;
  var message = req.flash('error');
  res.render('user/signup',{messages: message, hasErrors: message.length > 0 });
});

router.get('/signin',isNotLogin, function(req, res, next) {
    var cart = [];
    req.session.cart = cart;
    var message = req.flash('error');
    res.render('user/signin',{messages: message, hasErrors: message.length > 0 });
});

router.get('/buy-now', isLogin, function(req, res, next) {

    res.render('user/buy-now');
});

router.post('/buy-now', isLogin, function( req, res, next) {
        if(parseInt(req.session.balances) < (parseInt(req.body.prices) * parseInt(req.body.number))) {
            res.send({status: true});
        } else {
            var acc_address = req.session.address;
            var wallet =  ethWallet.fromPrivateKey(new Buffer.from(req.body.privateKey,'hex'));
            var acc_privateKey =  wallet.getAddressString();
            if(acc_address == acc_privateKey) {
                var arrID = [];
                var proDuctId = req.body.proDuctId;
                arrID.push(Transaction.toHex(proDuctId));
                var hashCode = req.body.hashCode;
                var description = req.body.description;
                var name  = req.body.name;
                var email = req.session.email;
                var number = [];
                 number.push(parseInt(req.body.number));
                var totalNumber = parseInt(req.body.totalNumber);
                var value =  parseInt(req.body.prices * number[0]);
                // console.log("75",value);
                Transaction.buy(arrID , email, number , req.session.address, req.body.privateKey, Config.contractAdress, value,
                (hash) => {
                    console.log(hash);
                    var myquery = { email: email };
                    var newvalues = { $set: {balances: req.session.balances - (req.body.prices * number[0] )  } };
                    var test1 = 0;
                    User.updateOne(myquery, newvalues, function(err, result) {
                        if(!err) {
                            test1++;
                            console.log("test1" + test1);
                        }
                    });
                    var buylist = new BuyList({
                        email: req.session.email,
                        id: proDuctId,
                        name: name,
                        prices: req.body.prices,
                        description: description,
                        hashCode: hashCode,
                        number: number[0],
                        transactionHash: hash,
                    });
                    // console.log(buylist);
                    var done = 0;
                    buylist.save( function(err, result) {
                        if(!err) {
                            done++;
                            console.log("done " + done);
                        }
                    });
                    var myquery = { _id: proDuctId };
                    var newvalues = { $set: {number: totalNumber - number[0]  } };
                    var test = 0;
                    Product.updateOne(myquery, newvalues, function(err, result) {
                        if(!err) {
                            test++;
                            console.log("test" + test);
                        }
                    });
                    res.send({ hash: hash});
                },
                (receipt) => {
                    console.log(receipt);
                },);
            } else {
                res.send({mes: "Private key not correct"});
            }
        }
});


router.post('/signin',function(req, res, next) {
    var email = req.body.email;
    req.session.email = email;
    User.findOne({'email' : email}, function(err, result) {
        console.log(result == null);
        if(result ==  null) {req.session.balances = 0;}
        else {
            req.session.balances = result.balances;
        }
        
    });
    Address.findOne({'email': email}, function(err, result) {
        if(result ==  null) {req.session.address = 0;}
        else {
            req.session.address = result.address;
        }
    });
    next();
} ,passport.authenticate('local.signin', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

router.post('/signup',function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    req.session.email = email;
    if(email == 'address1@gmail.com') {
        Transaction.setAccount(email, password, Config.address1, Config.contractAdress,Config.privateKey1);
    }

    if( email == 'address2@gmail.com') {
        Transaction.setAccount(email, password, Config.address2, Config.contractAdress,Config.privateKey2);
    }

    if(email == 'address3@gmail.com') {
        Transaction.setAccount(email, password, Config.address3, Config.contractAdress,Config.privateKey3);
    }

    if( email == 'address4@gmail.com') {
        Transaction.setAccount(email, password, Config.address4, Config.contractAdress,Config.privateKey4);
    }

    if(email == 'address5@gmail.com') {
        Transaction.setAccount(email, password, Config.address5, Config.contractAdress,Config.privateKey5);
    }
    console.log(email == 'address1@gmail.com');
    next();
},
 passport.authenticate('local.signup', {
  successRedirect: '/user/logout',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/logout',isLogin, function(req, res, next) {
    req.session.email = null;
    req.session.balances = null;
    req.session.address = null;
    localStorage.removeItem('cart');
    req.logout();
    res.redirect('/');
});


router.get('/profile',isLogin,function(req, res, next) {

    var email = req.session.email;
    Address.findOne({'email' : email}, function(err, result) {
        var myContract = new web3.eth.Contract(Config.abi,Config.contractAdress,{
            from: Config.address,
            data:Config.dataContract,
        });
        myContract.methods.getBalances(result.address).call({from: Config.address1}, function(error, result){
            console.log(error,result);
            res.render('user/profile', {data: result});
        });
       
    });

});

router.get('/err', function(req, res, next) {
    res.render('user/err');
});



router.post('/pay-cart', isLogin, function(req, res, next) {
    var email = req.session.email;
    var arrBuy = JSON.parse(req.body.arrBuy);
    var total = req.body.totalMoney;
    var privateKey = req.body.privateKey;
    var arrID = [];
    var arrNumberBuy = [];
        for(var i = 0; i < arrBuy.length; i++) {
          arrID.push(Transaction.toHex(arrBuy[i].id));
          arrNumberBuy.push(parseInt(arrBuy[i].numberBuy));
        }
        if(req.session.balances < total) {
            res.send({status: false});
        } 
        else {


                var acc_address = req.session.address;
                var wallet =  ethWallet.fromPrivateKey(new Buffer.from(privateKey,'hex'));
                var acc_privateKey =  wallet.getAddressString();
                if(acc_address == acc_privateKey) {
                    Transaction.buy(arrID , email, arrNumberBuy, req.session.address, privateKey, Config.contractAdress, parseInt(total),
                    (hash) => {
                    console.log(hash);  
                    var myquery = { email: email };///////////////
                    var newvalues = { $set: {balances: parseInt(req.session.balances) - parseInt(total)  } };
                    User.updateOne(myquery, newvalues, function(err, result) {
                        if(!err) {
                            console.log("OK -update");
                        }
                    });
    
                    var typeOfObj = [];
                    for(var i = 0; i < arrBuy.length; i++) {
                        typeOfObj.push(mongoose.Types.ObjectId(arrBuy[i].id));
                    }
                    Product.find({
                        '_id': { $in: typeOfObj}
                    }, function(err, docs){
                        // console.log(docs);
                        var buyList = [];
    
                        for( var i =0 ; i < arrBuy.length; i++ ) {
                            buyList.push(new BuyList( {
                                email: req.session.email,
                                id: docs[i]._id,
                                name: docs[i].name,
                                prices: docs[i].prices,
                                description: docs[i].description,
                                hashCode: docs[i].hashCode,
                                number: parseInt(arrBuy[i].numberBuy),
                                transactionHash: hash,
                            }) );
                        }
    
                        var done = 0;
                        for(var  i = 0; i < buyList.length; i++) {
                            buyList[i].save( function(err, result) {
                                if(!err) {
                                    done++;
                                    console.log(done);
                                }
                            });
                        }
    
                        var test  = 0;
                        for(var i = 0; i < buyList.length; i++) {
                            var myquery = { _id: arrBuy[i].id };
                            var newvalues = { $set: {number: arrBuy[i].totalNumber - arrBuy[i].numberBuy }};
                            Product.updateOne(myquery, newvalues, function(err, result) {
                                if(!err) {
                                    test++;
                                    console.log("Im test" + test);
                                }
                            });
                        }

                        });
                        localStorage.removeItem('cart');
                        res.send({hash: hash});
                    },
                     (receipt) => {
                    console.log(receipt);
                     },);
                } else {
                    res.send({mes: "Private key no correct"});
                }
        }
       

});

router.get('/information-buy', isLogin,function(req, res, next) {
    var email = req.session.email;
    // BuyList.aggregate([ 
    //     { $match: {"email": email}}, 
    //     { 
    //       $group: {
    //         _id: "$id",
    //         count: {
    //           $sum: 1
    //         },
    //         number: {$sum: '$number'},
    //         prices: {$sum: '$prices'},
    //       }
    //     }
    //   ], function(err, result) {
    //       console.log(result);
          
    //   });
    BuyList.find({'email': email}, function(err, data) {
        if(!err) {
            res.render('shop/information-buy', {data: data});
        }
    });

});

router.get('/verify/:id', function(req, res, next) {
    var id = req.params.id;
    Product.findById(id, function(err, result) {
        var address = result.address;
        Sign.findOne({'hasIMG': result.hashCode}, function(err, sign) {
            res.render('user/verify', {product: result, sign: sign});
        });
    });
}); 

router.post('/verify', function(req, res, next) {
    var address = req.body.address;
    var hash = req.body.hash;
    var v = parseInt(req.body.v);
    var r = req.body.r;
    var s = req.body.s;
    console.log(address, hash, v, r, s);
    Transaction.verifyDigitalSignature(address, hash, v, r, s, Config.address1, (result) => {
            res.send({result: result })
    });
})

module.exports = router;

function isLogin(req, res, next) {
    if( req.isAuthenticated()) {
        return next();
    }
    else{
        res.redirect('/user/signin');
    }

}

function isNotLogin(req, res, next) {
    if( !req.isAuthenticated()) {
        return next();
    }
    else{
        res.redirect('/');
    }

}



