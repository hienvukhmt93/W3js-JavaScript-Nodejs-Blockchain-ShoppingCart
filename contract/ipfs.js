const ipfsAPI = require('ipfs-api');
const fs = require('fs');
// const multiHash = require('multi-hash');
// const ipfsDag= require('ipfs-dag');

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
const dir = '/home/hienvu/Desktop/Data-IMG';
      var testFile = fs.readFileSync("/home/hienvu/Desktop/Data-IMG/11.jpg");
      var testBuffer = new Buffer(testFile);
ipfs.files.add(testBuffer, function (err, file) {
    if(err) {
        console.log(err);
    } else {
        console.log(file);
    }
});

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


// fs.readdir(dir, (err, files) => {
//     for(var i = 0 ; i < files.length; i++) {
//       var testFile = fs.readFileSync("/home/hienvu/Desktop/Data-IMG/"+files[i]);
//       var testBuffer = new Buffer(testFile);
//       ipfs.files.add(testBuffer, function (err, file) {
//             if(err) {
//                 console.log(err);
//             } else {
//                 console.log(file);
//             }
//         });
//     }
//   });



// var promise1 = new Promise(function (resolve , reject) {
//     fs.readdir(dir, (err, files) => {
//         for(var i = 0 ; i < files.length; i++) {
//           var testFile = fs.readFileSync("/home/hienvu/Desktop/Data-IMG/"+files[i]);
//           var testBuffer = new Buffer(testFile);
//           ipfs.files.add(testBuffer, function (err, file) {
//               if (!err) {
//                 resolve(test);
//               } else {
//                   reject(err);
//               }

//             });
//         }
//       });
// });

// Promise.all([promise1]).then(function(values) {
//     console.log(values);
// });

//Reading file from computer
// let testFile = fs.readFileSync("/home/hienvu/cat.jpg");
// //Creating buffer for ipfs function to add file to the system
// let testBuffer = new Buffer(testFile);

//Addfile router for adding file a local file to the IPFS network without any local node

    // ipfs.files.add(testBuffer, function (err, file) {
    //     if (err) {
    //       console.log(err);
    //     }
    //     console.log(file)
    //   });
//Getting the uploaded file via hash code.
    
    // This hash is returned hash of addFile router.
    // const validCID = 'Qmd286K6pohQcTKYqnS1YhWrCiS4gz7Xi34sdwMe9USZ7u'

    // ipfs.files.get(validCID, function (err, files) {
    //     files.forEach((file) => {
    //       console.log(file.path);
    //     //   console.log(file.content.toString('utf8'))
    //     })
    //   })
