
const Transaction = require('./Transaction');
const Config = require('./Config');
const Web3 					= require('web3');
const ExpressFunction       = require('./ExpressFunction');
const  web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/Z4It2Ma8e6CaZDeRH2HB'));
const _ 					= require('lodash');
const ethWallet 			= require('ethereumjs-wallet');
const ethUtil 				= require('ethereumjs-util');
const Tx 					= require('ethereumjs-tx');
const Sign = require('../models/sign');
var Product = require('../models/products');

var mongoose = require('mongoose');
   
mongoose.connect('mongodb://localhost:27017/shopping');

// var wallet =  ethWallet.fromPrivateKey(new Buffer.from(Config.privateKey1,'hex'));
// console.log(wallet.getAddressString());

//    for(var i = 0; i < hashIMG.length; i++) {
//     var sign = web3.eth.accounts.sign(hashIMG[i], '0x' + Config.privateKey1,{from: Config.address1});
//     var img_sign  = new Sign({
//         email: 'address1@gmail.com',
//         address: Config.address1,
//         hashCode: hashIMG[i],
//         v: sign.v,
//         r: sign.r,
//         s: sign.s
//     });
//     img_sign.save(function(err, result) {
//     });
//    }

// console.log(sign);
// var address = web3.eth.accounts.recover('', sign.v, sign.r, sign.s);
// console.log(address);
// console.log(sign.v);\
// var prefix = "\x19Ethereum Signed Message:\n32"
// var  prefixedHash = web3.utils.sha3(prefix, hashIMG[3]);
// for(var i =0 ; i< hashIMG.length;i++) {
//     console.log(hashIMG[i]);
//     // var prefix = "\x19Ethereum Signed Message:\n32";
//     var  prefixedHash = web3.utils.sha3( hashIMG[i]);
//     console.log(prefixedHash);
// }
var hashIMG = [
    "QmUZNPqMkFdcePwRbD2PDLjksX8UQkmTrAb3marn3MSS4L", 
    "QmYezBH9QF2ZRACqEYAoZSv1k7rTRH9n1vjBjRXLqfUsEE",
    "QmXVXzJg4PnpbCeHTzTxhVVDEjLMb6XxX9gCervRpKax4L",
    "QmeF69y7jvWQLm2whZSwUHzPCPTJxvRdFNwbmMLep2FLwu",
    "QmTJvMwWYiDuVrAsjhRcZRjXvFNqf7aPeRcvyWVmXJFZZ2",
    "QmUCJLGbjaYyoSaLRoWWBN6JvM1YqAKTzd8LrhzZELPa44",
    "QmYLYzcZnqFo3HgcvTvignHzA83xZkDNDVJXbZ86UhbNMx",
    "Qma9UcjN4rpWjAHc58MmRjRLFoJAmqxMMoq5iDqQi5vgxF",
    "QmcH3j8GHYkBXKRTM86i7GQtR8nZkC28GEUAtqjbQrSDjP",
   ];
// var sign = web3.eth.accounts.sign(web3.utils.sha3(hashIMG[8]), '0x' + Config.privateKey1,{from: Config.address1});
// console.log(sign);
// var address = web3.eth.accounts.recover(web3.utils.sha3(hashIMG[0]), sign.v, sign.r, sign.s);
var test = [
    new Sign( {
        hasIMG:'QmUZNPqMkFdcePwRbD2PDLjksX8UQkmTrAb3marn3MSS4L' ,
        hashMessage:'0xdd91c8d780b41d8c748a914ecdfa578a436d086dc0717d9a0404dd3af98bf125' ,
        v: '0x1c',
        r: '0x86b3ecd6c8a2bf0872174df626bcfb3d32a68b38c79c666b78ed29a7979716bd',
        s: '0x600066b10c62304355e56ddc073c2e3ed2424824870e8904ef80b677f1378fad'
    }),
    new Sign( {
        hasIMG:'QmYezBH9QF2ZRACqEYAoZSv1k7rTRH9n1vjBjRXLqfUsEE' ,
        hashMessage:'0xbdd807f8cdbc7a2afd12aa0127455e6d8166a6e9cf07a5633072d67a08d28a1e' ,
        v: '0x1b',
        r: '0x934575440f82fd893deb9ddace94cde2a7043b312150a46cbee2fe009a0b7f0a',
        s: '0x6fef6db69caf225646f95c52cd3acfd990298a9bfb8a60e69061ab8fa0f9d3a2'
    }),
    new Sign( {
        hasIMG:'QmXVXzJg4PnpbCeHTzTxhVVDEjLMb6XxX9gCervRpKax4L' ,
        hashMessage:'0xede0ce12fec0efd11b24d97b10a5b6ca94dd6f62a692939f912d4e417f6ad993' ,
        v: '0x1c',
        r: '0xb2e22d4da754ffbe4025ab74e4a279f983985fbca6bdd7f6bc2cdf94bed218a4',
        s: '0x68a0c312c912d8eaa65838efeb3ac1be728e79ed952e5721e40538f8e23d59e2'
    }),
    new Sign( {
        hasIMG:'QmeF69y7jvWQLm2whZSwUHzPCPTJxvRdFNwbmMLep2FLwu' ,
        hashMessage:'0xe4c639dc3e9e95de96dc8ddb5523657d0a4db9b99b7563552a5cc2cd4a02d633' ,
        v: '0x1b',
        r: '0x799fd1617e6a0b5ce3d2cecc5c8d3f19963222e0e06168bb3879801a0409429e',
        s: '0x732db05fa693c5815c89a9a78b62077a90a2f45f3070d4c81d54733de17d37e6'
    }),
    new Sign( {
        hasIMG:'QmTJvMwWYiDuVrAsjhRcZRjXvFNqf7aPeRcvyWVmXJFZZ2' ,
        hashMessage:'0xe34bb60faf328bb1f6a314c160488bb4631b69252687f91d6567036c402e73cb' ,
        v: '0x1c',
        r: '0x49e66d6a706a8687deafe94c5792ecaa6a811db9ff636a5aa25e908a37cc21be',
        s: '0x19ff0804e9897ce3fca3966ae4bc28a8a4834947a88177975d0fde0b91bb7279'
    }),
    new Sign( {
        hasIMG:'QmUCJLGbjaYyoSaLRoWWBN6JvM1YqAKTzd8LrhzZELPa44' ,
        hashMessage:'0x378597c96be3b11a6623447716a316ef8eb52d84196528b32957f2f019ec7a03' ,
        v: '0x1c',
        r: '0x8a49b677c2c38f3fe61b3120f4ab8b3be3a11cba727d727d0cad6a545bfd41b5',
        s: '0x16d1aa51b2599ad39e9f8c17cb32fdba035b32dd20ee8e3657d5ec73c1d8cf5c'
    }),
    new Sign( {
        hasIMG:'QmYLYzcZnqFo3HgcvTvignHzA83xZkDNDVJXbZ86UhbNMx' ,
        hashMessage:'0xee81627493a0e754f0f468d7f65055463a8d8f5457f40eb56eef819cde5a26e8' ,
        v: '0x1c',
        r: '0x342ed82ad751ca4830d151696bfe0248bf1869967aa878955b684fe93439f211',
        s: '0x53e543cc642b404c8ba39ae25b7a6bf579e2688a3a98ee1586c954c3f31ab0e5'
    }),
    new Sign( {
        hasIMG:'Qma9UcjN4rpWjAHc58MmRjRLFoJAmqxMMoq5iDqQi5vgxF' ,
        hashMessage:'0xbf5ba96fe6fd87c6b26d7b9ac459af1c41db98013bc978c5dd59a8e02a250828' ,
        v: '0x1c',
        r: '0x90c359c3f99000a6b564400d3d27ecea932a4a5184efb95cf43c105ed6830921',
        s: '0x6ccf967551a2467ac7f1fc0e5f3cea0b55030b31fa08b2d08cfc58d535dd0f96'
    }),
    new Sign( {
        hasIMG:'QmcH3j8GHYkBXKRTM86i7GQtR8nZkC28GEUAtqjbQrSDjP' ,
        hashMessage:'0xc43d7e7287f20e593bbc4453b194754690e1024ade4bb9bb84b106177dcb55b3' ,
        v: '0x1b',
        r: '0x0d9fa6e301aa8ba0917a190be00967a567702b44674b391c6df43131cbcf9c27',
        s: '0x24f017d3506fcb5389bbf734e75a2079829ff196e98b754f9672fc7014b47c0f'
    }),
];
// var done =0;
// for(var i =0; i< test.length;i++) {
//     test[i].save(function(err, result) {
//         done++;
//         console.log(done);
//         if(done == test.length) {
//             mongoose.disconnect();
//         }
//     });
// }

console.log(Transaction.toHex("hahahss"));