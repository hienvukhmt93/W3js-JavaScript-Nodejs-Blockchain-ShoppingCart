var Product = require('../models/products');

var mongoose = require('mongoose');
var Config = require('../contract/Config');
   
mongoose.connect('mongodb://localhost:27017/shopping');
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
var products = [
    new Product({
        name: 'Bột Làm Trắng Da ',
        prices: 100,
        description: 'So good Pro , Cool',
        detail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        hashCode: hashIMG[0],
        number: 100,
        address: Config.address1
    }),
    new Product({
        name: 'Thuốc tẩy chân lông ',
        prices: 200,
        description: 'Cam kết trắng da 1 đổi 1',
        detail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        hashCode: hashIMG[1],
        number: 90,
        address: Config.address1
    }),
    new Product({
        name: 'Mỹ phẩm làm đen da ',
        prices: 300,
        description: 'Không đen không lấy tiền',
        detail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        hashCode: hashIMG[2],
        number: 80,
        address: Config.address1
    }),
    new Product({
        name: 'Sản phẩm Korea ',
        prices: 400,
        description: 'De chang kum',
        detail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        hashCode: hashIMG[3],
        number: 70,
        address: Config.address1
    }),
    new Product({
        name: 'Chân dài đến nách ',
        prices: 500,
        description: 'Oh ! cool',
        detail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        hashCode: hashIMG[4],
        number: 60,
        address: Config.address1
    }),
    new Product({
        name: 'My Pham VN ',
        prices: 600,
        description: 'Very good !',
        detail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        hashCode: hashIMG[5],
        number: 50,
        address: Config.address2
    }),
    new Product({
        name: 'My Pham VN ',
        prices: 700,
        description: 'So good Pro , Cool',
        detail: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
        hashCode: hashIMG[6],
        number: 40,
        address: Config.address2
    })
];
var done = 0;
for(var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if(done == products.length) {
            mongoose.disconnect();
            console.log('Sucs');
        }
    });
}
