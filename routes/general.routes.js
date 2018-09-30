const express = require("express");
const router = express.Router();
const passport = require("passport");
var product = require("../models/product.model");
var Cart = require("../models/cart.model");

// Require the controllers WHICH WE DID NOT CREATE YET!!

// router.get('/abcd',function(req,res,next){

//     //getting form data
//     var productt = new product({
//         imagePath: "/images/10.jpg",
//         title: "mobile3",
//         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum incidunt, quidem dolores natus corporis beatae soluta sapiente iste sed repellat expedita modi cumque pariatur libero sit! Qui voluptates laudantium laborum?",
//         price: 1000,
//         category: 'mobile'
//     });
//     productt.save();
// });


// returns home page 
router.get("/home", function(req, res, next) {
  resultArrayLaptop = [];
  resultArrayMobile = [];
  resultArrayCamera = [];

  product.find({ category: "laptop" }, function(err, docs) {
    for (var i = 0; i < 3; i += 3) {
      resultArrayLaptop.push(docs.slice(i, i + 3));
    }
  });
  product.find({ category: "mobile" }, function(err, docs) {
    for (var i = 0; i < 3; i += 3) {
      resultArrayMobile.push(docs.slice(i, i + 3));
    }
  });
  product.find({ category: "camera" }, function(err, docs) {
    for (var i = 0; i < 3; i += 3) {
      resultArrayCamera.push(docs.slice(i, i + 3));
    }
  });

  res.render("home", {
    title: "general",
    productsLaptops: resultArrayLaptop,
    productsMobiles: resultArrayMobile,
    productsCameras: resultArrayCamera
  });
});

router.get("/add-to-cart/:id", function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect("/singleProduct/"+productId);
    }
    cart.add(product, productId);
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
  product.find({ category: req.params.category }, function(err, docs) {
    for (var i = 0; i < docs.length; i += 3) {
      resultArray.push(docs.slice(i, i + 3));
    }

    res.render("categoryWise", {
      title: "general",
      category: req.params.category,
      products: resultArray
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