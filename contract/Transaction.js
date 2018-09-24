const _ 					= require('lodash');
const ethWallet 			= require('ethereumjs-wallet');
const ethUtil 				= require('ethereumjs-util');
const Tx 					= require('ethereumjs-tx');
const Web3 					= require('web3');
const Config                = require('./Config');
const ExpressFunction       = require('./ExpressFunction');
const  web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Z4It2Ma8e6CaZDeRH2HB'));
const abiContract = new web3.eth.Contract(Config.abi);

module.exports = {
    deploy: async function deploy(address, privateKey) {
        var myContract = new web3.eth.Contract(Config.abi);
        var selt = myContract.deploy({
             data: Config.dataContract,
             arguments: [100, "MyToken"]
            }).encodeABI();
        var result = await  web3.eth.getTransactionCount(address);
        var Txraw = await {
        nonce: result,
        gasPrice: web3.utils.toHex(web3.utils.toWei('40','Gwei')),
        gasLimit: web3.utils.toHex('973182'),
        data:  selt,
        from: address
        };

        var TxSign = await ExpressFunction.TxSign(Txraw, privateKey);
    
        await web3.eth.sendSignedTransaction( TxSign)
        .on('transactionHash', function(hash){
            console.log('47 ',hash);
        })
        .on('receipt', function(receipt){
            console.log('50 ',receipt.contractAddress);
            console.log('50 ', receipt.from);
         })
        .on('error', console.error); 
    },
    getUsername: function getUsername(address) {
        var myContract = new web3.eth.Contract(Config.abi,Config.contractAdress,{
            from: address,
            data:Config.dataContract,
        });
        myContract.methods.getUsername().call({from: address}, function(error, result){
            console.log(error,result);
        });
    },
    getBalances: function getBalances(address) {
        var myContract = new web3.eth.Contract(Config.abi,Config.contractAdress,{
            from: Config.address,
            data:Config.dataContract,
        });
        myContract.methods.getBalances(address).call({from: address}, function(error, result){
            console.log(error,result);
        });
    },
    getBuyIdProduct: function getBuyIdProduct(username) {
        var myContract = new web3.eth.Contract(Config.abi,Config.contractAdress,{
            from: Config.address,
            data:Config.dataContract,
        });
        myContract.methods.getBuyIdProduct(username).call({from: Config.address}, function(error, result){
            console.log(error,result);
        });
    },
    setAccount: async function setAccount(name, pass, address, contractAddress, privateKey) {
        var result = await web3.eth.getTransactionCount(address); 
        var tx_builder = abiContract.methods.setAccount(name, pass);
        var encoded_tx = tx_builder.encodeABI();
        var Txraw = {
        nonce: result,
        gasPrice: web3.utils.toHex(web3.utils.toWei('40','Gwei')),
        gasLimit: web3.utils.toHex('973182'),
        data:  encoded_tx,
        from: address,
        to: contractAddress,
        };

        var TxSign = ExpressFunction.TxSign(Txraw, privateKey);
    
        web3.eth.sendSignedTransaction(TxSign)
        .on('transactionHash', function(hash){
             console.log('98 ',hash);
        })
        .on('receipt', function(receipt){
            console.log('101 ', receipt);
         })
        .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
    },
    setBalances : async function setBalances(spender, username, from, contractAddress, privateKey, onHash, onReceipt) {
        var result = await web3.eth.getTransactionCount(from); 
        var tx_builder = abiContract.methods.setBalances(spender, username);
        var encoded_tx = tx_builder.encodeABI();
        var Txraw = {
        nonce: result,
        gasPrice: web3.utils.toHex(web3.utils.toWei('40','Gwei')),
        gasLimit: web3.utils.toHex('973182'),
        data:  encoded_tx,
        from: from,
        to: contractAddress,
        };

        var TxSign = ExpressFunction.TxSign(Txraw, privateKey);
    
        web3.eth.sendSignedTransaction(TxSign)
        .on('transactionHash', function(hash){
            onHash(hash);
            //  console.log('98 ',hash);
        })
        .on('receipt', function(receipt){
            onReceipt(receipt);
            // console.log('101 ', receipt);
         })
        .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
    },
    transfer: async function transfer(addressTransfer, ownerAdress, contractAddress, privateKey) {
        var result = await web3.eth.getTransactionCount(ownerAdress); 
        var tx_builder = abiContract.methods.TransferOwner(addressTransfer);
        var encoded_tx = tx_builder.encodeABI();
        var Txraw = {
        nonce: result,
        gasPrice: web3.utils.toHex(web3.utils.toWei('40','Gwei')),
        gasLimit: web3.utils.toHex('973182'),
        data:  encoded_tx,
        from: ownerAdress,
        to: contractAddress,
        };

        var TxSign = ExpressFunction.TxSign(Txraw, privateKey);
    
        web3.eth.sendSignedTransaction(TxSign)
        .on('transactionHash', function(hash){
             console.log('98 ',hash);
        })
        .on('receipt', function(receipt){
            console.log('101 ', receipt);
         })
        .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
    },
     
    buy: async function buy(arrBuy, username, numberBuy, address, privateKey, contractAddress, value, onHash ,onReceipt) {
            var result = await web3.eth.getTransactionCount(address); 
            var tx_builder = abiContract.methods.buy(arrBuy, username, numberBuy);
            var encoded_tx = tx_builder.encodeABI();
            var Txraw = await {
            nonce: result,
            gasPrice: web3.utils.toHex(web3.utils.toWei('40','Gwei')),
            gasLimit: web3.utils.toHex('973182'),
            data:  encoded_tx,
            from: address,
            value: web3.utils.toHex(web3.utils.toWei(value.toString(),'wei')),
            to: contractAddress,
            };
            var TxSign = await ExpressFunction.TxSign(Txraw, privateKey);
            web3.eth.sendSignedTransaction(TxSign)
            .on('transactionHash', function(hash){
                onHash(hash);
            })
            .on('receipt', function(receipt){
                onReceipt(receipt);
            })
            .on('error', console.error); 
                console.error;
            }
        ,
    setData: async function setData(idProDuct, imgPath, productName, productPrice, description, detail) {
        var result = await web3.eth.getTransactionCount(Config.address); 
        var tx_builder = abiContract.methods.setData(idProDuct, imgPath, productName, productPrice, description, detail);
        var encoded_tx = tx_builder.encodeABI();
        var Txraw = await {
        nonce: result,
        gasPrice: web3.utils.toHex(web3.utils.toWei('40','Gwei')),
        gasLimit: web3.utils.toHex('3000000'),
        data:  encoded_tx,
        from: Config.address,
        to: Config.contractAdress,
        };
        var TxSign = await ExpressFunction.TxSign(Txraw, Config.privateKey);
        web3.eth.sendSignedTransaction(TxSign)
        .on('transactionHash', function(hash){
            console.log('98 ',hash);
        })
        .on('receipt', function(receipt){
            console.log('101 ', receipt);
        })
        .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
        },
    approve: async function approve(username, addspender, amount , from ,privateKey, contractAddress, onHash, onReceipt) {
            var result = await web3.eth.getTransactionCount(from); 
            var tx_builder = abiContract.methods.approve(username, addspender);
            var encoded_tx = tx_builder.encodeABI();
            var Txraw = await {
            nonce: result,
            gasPrice: web3.utils.toHex(web3.utils.toWei('40','Gwei')),
            gasLimit: web3.utils.toHex('3000000'),
            data:  encoded_tx,
            from: from,
            value: amount,
            to: contractAddress,
            };
            var TxSign = await ExpressFunction.TxSign(Txraw, privateKey);
            web3.eth.sendSignedTransaction(TxSign)
            .on('transactionHash', function(hash){
                onHash(hash);
                // console.log('98 ',hash);
            })
            .on('receipt', function(receipt){
                onReceipt(receipt);
                // console.log('101 ', receipt);
            })
            .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
            },

    verifyDigitalSignature: async function verifyDigitalSignature(addressOwner, hash, v, r, s, from, hashResult) {
            var myContract = new web3.eth.Contract(Config.abi,Config.contractAdress,{
                from: Config.address1,
                data:Config.dataContract,
            });
            myContract.methods.verifyDigitalSignature(addressOwner, hash, v, r, s).call({from: from}, function(error, result){
                hashResult(result);
            }); 
        },
    toHex: function toHex(value) {
            var data = web3.utils.toHex(value);
            return data;
         }
         , 
    toSha3: function toSha3(hashIMG) {
            // var prefix = "\x19Ethereum Signed Message:\n32";
            var  prefixedHash = web3.utils.sha3(hashIMG);
            return prefixedHash;
         },
    signIMG:async function signIMG(hash, v, r, s, from, contractAddress, privateKey, onHash, onReceipt ) {
            var result = await web3.eth.getTransactionCount(from); 
            var tx_builder = abiContract.methods.sign(hash, v,r,s);
            var encoded_tx = tx_builder.encodeABI();
            var Txraw = await {
            nonce: result,
            gasPrice: web3.utils.toHex(web3.utils.toWei('40','Gwei')),
            gasLimit: web3.utils.toHex('3000000'),
            data:  encoded_tx,
            from: from,
            to: contractAddress,
            };
            var TxSign = await ExpressFunction.TxSign(Txraw, privateKey);
            web3.eth.sendSignedTransaction(TxSign)
            .on('transactionHash', function(hash){
                onHash(hash);
                // console.log('98 ',hash);
            })
            .on('receipt', function(receipt){
                onReceipt(receipt);
                // console.log('101 ', receipt);
            })
            .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
            },
};
























// var promise1 = new Promise(function (resolve , reject) {
//     web3.eth.getTransactionCount(Config.address, function(err, result) {
// if(!err) {
//     resolve(result);
// }
// else {
//     reject(err);
// }
// });
// });

// Promise.all([promise1]).then(function(values) {
//     var privateKey = Config.privateKey;
//     var selt = myContract.deploy({
//         data: Config.dataContract,
//         arguments: ['Hien', 'HienVu',100]
//     }).encodeABI();
//     var Txraw = {
//         nonce: values,
//         gasPrice: web3.utils.toHex(web3.utils.toWei('4','Gwei')),
//         gasLimit: web3.utils.toHex('900000'),
//         data:  selt,
//         from: Config.address
//     };
//     console.log(Txraw);
//     TxSign = ExpressFunction.TxSign(Txraw, privateKey);
    
//     web3.eth.sendSignedTransaction( TxSign, function(err, hash) {
//         console.log(hash);
//     })


//   });










