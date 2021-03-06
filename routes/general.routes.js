const express = require("express");
const router = express.Router();
const passport = require("passport");
var product = require("../models/Product");
var Cart = require("../models/cart.model");





// // returns home page 
// router.get("/home", function(req, res, next) {
//   resultArrayLaptop = [];
//   resultArrayMobile = [];
//   resultArrayCamera = [];
//   rev_resultArrayLaptop = [];
//   rev_resultArrayMobile = [];
//   rev_resultArrayCamera = [];


  
//   product.find({ category: "laptop" }, function(err, docs) {
//     for (var i = docs.length-1; i > -1; i -= 1) {    
//       resultArrayLaptop.push(docs[i]);
//     }
//     for (var i = 0; i < resultArrayLaptop.length; i += 3) {    
//       rev_resultArrayLaptop.push(resultArrayLaptop.slice(i,i+3));
//       break;
//     }
//   })
//   .then(()=>{
//     product.find({ category: "mobile" }, function(err, docs) {
//       for (var i = docs.length-1; i > -1; i -= 1) {    
//         resultArrayMobile.push(docs[i]);
//       }
//       for (var i = 0; i < resultArrayMobile.length; i += 3) {    
//         rev_resultArrayMobile.push(resultArrayMobile.slice(i,i+3));
//         break;
//       }
//     });
//   })
//   .then(()=>{
//     product.find({ category: "camera" }, function(err, docs) {
//       for (var i = docs.length-1; i > -1; i -= 1) {    
//         resultArrayCamera.push(docs[i]);
//       }
//       for (var i = 0; i < resultArrayCamera.length; i += 3) {    
//         rev_resultArrayCamera.push(resultArrayCamera.slice(i,i+3));
//         break;
//       }
//     });
//   })
//   .then(()=>{
//     res.render("home", {
//       title: "general",
//       productsLaptops: rev_resultArrayLaptop,
//       productsMobiles: rev_resultArrayMobile,
//       productsCameras: rev_resultArrayCamera
//     });
//   })
// });


// Adding product to the cart
router.post("/add-to-cart/:id", function(req, res, next) {
  var productId = req.params.id;
  var quantity = parseInt(req.body.qoqo,10);
  console.log(typeof(quantity));
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect("/singleProduct/"+productId);
    }
    cart.add(product, productId, quantity);
    req.session.cart = cart;

    res.redirect("/singleProduct/"+productId);
  });
});

router.get("/reduce/:_id", function(req, res, next) {
  var productId = req.params._id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect("/cartView");
    }

    cart.reduce(product, productId);

    req.session.cart = cart;

    res.redirect("/cartView");
  });
});

router.get("/increase/:_id", function(req, res, next) {
  var productId = req.params._id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect("/cartView");
    }

    cart.increase(product, productId);

    req.session.cart = cart;

    res.redirect("/cartView");
  });
});

router.get("/removeAll/:_id", function(req, res, next) {
  var productId = req.params._id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect("/cartView");
    }
    cart.removeAll(product, productId);
    req.session.cart = cart;
    res.redirect("/cartView");
  });
});

router.get("/cartView", function(req, res, next) {
  if (!req.session.cart) {
    return res.render("shoppingCart", { products: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("shoppingCart", {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

router.get("/FilteredByCategory/:category", function(req, res, next) {
  resultArray = [];
  rev_resultArray = [];
  product.find({ category: req.params.category }, function(err, docs) {
    
    for (var i = docs.length-1; i > -1; i -= 1) {    
      resultArray.push(docs[i]);
    }
    for (var i = 0; i < resultArray.length; i += 3) {    
      rev_resultArray.push(resultArray.slice(i,i+3));
    }

    res.render("categoryWise", {
      title: "general",
      category: req.params.category,
      products: rev_resultArray
    });
  });
});

router.get("/singleProduct/:id", function(req, res, next) {
  resultArray = {};
  product.findById(req.params.id, function(err, product) {
    resultArray = product;

    res.render("singleProductView", {
      title: "general",
      product: resultArray
    });
  });
});

module.exports = router;
