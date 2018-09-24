var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var Cart = require('../models/cart');
const Transaction = require('../contract/Transaction');
const Config = require('../contract/Config');
var Address = require('../models/address');
var User = require('../models/user');
const Sign = require('../models/sign');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');




/* GET home page. */
router.get('/', function(req, res, next) {
  var email = req.session.email;
  // console.log(email);

  if(email != null) {
    User.findOne({'email' : email}, function(err, result) {
      if(err) {
          next();
      } else {
          req.session.balances = result.balances;
      }
      });
  } else {
    req.session.email = null;
    req.session.balances = null;
  }
  Product.find( function(err, docs) {
    res.render('shop/index', { title: 'Shopping-Carts', param: docs });
  });
});

router.get('/buy-now/:id', isLogin, function(req, res, next) {
    var proDuctId= req.params.id;
    var accAddress = req.session.address;
    // console.log(accAddress);
    // var cart = new Cart(req.session.cart ? req.session.cart: {});
    Product.findById(proDuctId, function(err, product) {
      if( err) {
        return res.redirect('/');
      }
      var email = req.session.email;
      // console.log(email);

      Address.findOne({'email': email}, function(err, address) {
          if(err) {
            res.redirect('/');
          }
          res.render('user/buy-now',{proDuctId: proDuctId, product: product,address: address, accAddress: accAddress });
      });
    });
});

router.get('/add-to-cart/:id', isLogin, function(req, res, next) {
  var proDuctId= req.params.id;
  var x = JSON.parse(localStorage.getItem('cart'));
  var cart = new Cart(x? x: {});
  Product.findById(proDuctId, function(err, product) {
    if( err) {
      return res.redirect('/');
    }
    // console.log('product', product);
    cart.add(product);
    // console.log("68" ,cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    res.redirect('/');
  });
});

router.get('/shopping-cart', isLogin, function(req, res, next) {
  var items = JSON.parse(localStorage.getItem('cart'));
  // console.log(items);
  // console.log(items == null);

  if(items == null) {
    return res.render('user/pay-cart', {products: null});
  } else {
    var itemsCart = new Cart(items);
    // console.log("X",itemsCart.getItems());
    // console.log("Total", itemsCart.totalPrices);
    // console.log(itemsCart == null);
    var max_arr = itemsCart.getItems().length;
    // console.log("max_arr",max_arr);
    res.render('user/pay-cart',{products: itemsCart.getItems(), totalPrices: itemsCart.totalPrices, max_arr});
  }

});



router.get('/remove-all', function(req, res, next) {
    localStorage.removeItem('cart');
    var items = JSON.parse(localStorage.getItem('cart'));
    // console.log(items);
    // var itemsCart = new Cart(items);
    // console.log(items == null);
    if(items ==  null) {
      res.send({status: true});
    }

});

router.get('/delete-by-one/:id', function(req, res, next) {
    // console.log("Body", req.body);
    var id = req.params.id;
    // console.log("ID", id);
    var items = JSON.parse(localStorage.getItem('cart'));
    var itemsCart = new Cart(items);
    // console.log('116',itemsCart.totalPrices);
    var getItem = itemsCart.getItems();
    for( var i = 0 ; i < getItem.length; i++) {
      // console.log('118',getItem[i].id);
      // console.log(id == getItem[i].id);
      if(id == getItem[i].id) {
        itemsCart.totalPrices -= getItem[i].prices;
        // console.log("sadasdasdasdasdasasdas");
      }
    }
    itemsCart.remove(id);
    localStorage.setItem('cart', JSON.stringify(itemsCart));
    // console.log("Delete-by-One",itemsCart);
    res.send({status: true});
});




router.get('/detail/:id', function(req, res, next) {
  var proDuctId= req.params.id;
  // console.log(proDuctId);
  // var cart = new Cart(req.session.cart ? req.session.cart: {});
  Product.findById(proDuctId, function(err, product) {
    if( err) {
      return res.redirect('/');
    } else {
      res.render('shop/detail', {product: product});
    }

  });
});


router.get('/search', function(req, res, next) {
    var keyWord = req.body.keyWord;

    
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

