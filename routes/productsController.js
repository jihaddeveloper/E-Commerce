//Imports
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

var mongo = require("mongodb");

const multer = require("multer");
const Product = require("../models/Product");

//Image save to DB Start
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const path = require("path");
const crypto = require("crypto");

const mongoURI = "mongodb://localhost:27017/e-commerce_db";

//Mongo connection
const conn = mongoose.createConnection(mongoURI);

//Init gfs
let gfs;

//Init Stream
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("products");
});

//Storage Engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "products"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });


//Product register form
router.get("/register", ensureAuthenticated, (req, res) => {
  res.render("products/register");
});

//Product register process
router.post(
  "/registerSave",
  ensureAuthenticated,
  upload.single("imagePath"),
  (req, res) => {
    let errors = [];

    if (!req.body.title) {
      errors.push({
        text: "Please add a title"
      });
    }

    if (!req.body.category) {
      errors.push({
        text: "Please add a category"
      });
    }

    if (!req.body.price) {
      errors.push({
        text: "Please add a price"
      });
    }

    if (!req.body.description) {
      errors.push({
        text: "Please add some description"
      });
    }

    if (errors.length > 0) {
      res.render("products/register", {
        errors: errors,
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        imagePath: req.body.imagePath
      });
    } else {
      const newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        imagePath: req.file.originalname,
        user: req.user.id
      };
      new Product(newProduct).save().then(product => {
        req.flash("success_msg", "Product added.");
        res.redirect("/products/home");
      });
    }
  }
);

// Fetching by category data in product schema
router.get("/category/:category", function(req, res, next) {
  resultArray = [];
  Product.find({ category: req.params.category }, function(err, docs) {
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

// saving data in product schema
router.get("/view", function(req, res, next) {
  resultArray = [];
  Product.find(function(err, docs) {
    for (var i = docs.length - 1; i > -1; i -= 1) {
      resultArray.push(docs[i]);
    }
    res.render("allProductView", { title: "general", products: resultArray });
  });
});

// pin the product to top
router.get("/pin/:id", function(req, res, next) {
  console.log(req.params.id);
  Product.update(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: { pinned: "true" }
    },
    function(err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/products/view");
      }
    }
  );
});

// unpin the product to top
router.get("/unpin/:id", function(req, res, next) {
  console.log(req.params.id);
  Product.update(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: { pinned: "" }
    },
    function(err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/products/view");
      }
    }
  );
});

// Add to home page
router.get("/home/:id", function(req, res, next) {
  console.log(req.params.id);
  Product.update(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: { home: "true" }
    },
    function(err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/products/view");
      }
    }
  );
});

// remove from home page
router.get("/unhome/:id", function(req, res, next) {
  console.log(req.params.id);
  Product.update(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: { home: "" }
    },
    function(err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/products/view");
      }
    }
  );
});

// delete product
router.get("/delete/:id", function(req, res, next) {
  Product.deleteOne({ _id: mongo.ObjectID(req.params.id) }, function(
    err,
    bear
  ) {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/products/view");
    }
  });
});

// search
router.post("/search", function(req, res, next) {
  var txt = req.body.key_text;
  var resultArray = [];

  Product.find({ category: txt.toLowerCase() }, function(err, docs) {
    for (var i = 0; i < docs.length; i += 3) {
      resultArray.push(docs.slice(i, i + 3));
    }
    if (resultArray.length > 0) {
      res.render("categoryWise", {
        title: "general",
        category: req.params.category,
        products: resultArray
      });
    } else {
      Product.find({ title: txt.toLowerCase() }, function(err, docs) {
        for (var i = 0; i < docs.length; i += 3) {
          resultArray.push(docs.slice(i, i + 3));
        }
        res.render("categoryWise", {
          title: "general",
          category: req.params.category,
          products: resultArray
        });
      });
    }
  });
});

// returns home page
router.get("/home", function(req, res, next) {
  resultArrayLaptop = [];
  resultArrayMobile = [];
  resultArrayCamera = [];
  resultArrayPinned = [];
  rev_resultArrayLaptop = [];
  rev_resultArrayMobile = [];
  rev_resultArrayCamera = [];
  rev_resultArrayPinned = [];

  Product.find({ category: "laptop", home: "true" }, function(err, docs) {
    for (var i = docs.length - 1; i > -1; i -= 1) {
      resultArrayLaptop.push(docs[i]);
    }
    for (var i = 0; i < resultArrayLaptop.length; i += 3) {
      rev_resultArrayLaptop.push(resultArrayLaptop.slice(i, i + 3));
      break;
    }
  })
    .then(() => {
      Product.find({ pinned: "true" }, function(err, docs) {
        for (var i = docs.length - 1; i > -1; i -= 1) {
          resultArrayPinned.push(docs[i]);
        }
        for (var i = 0; i < resultArrayPinned.length; i += 3) {
          rev_resultArrayPinned.push(resultArrayPinned.slice(i, i + 3));
          break;
        }
      });
    })
    .then(() => {
      Product.find({ category: "mobile", home: "true" }, function(err, docs) {
        for (var i = docs.length - 1; i > -1; i -= 1) {
          resultArrayMobile.push(docs[i]);
        }
        for (var i = 0; i < resultArrayMobile.length; i += 3) {
          rev_resultArrayMobile.push(resultArrayMobile.slice(i, i + 3));
          break;
        }
      });
    })
    .then(() => {
      Product.find({ category: "camera", home: "true" }, function(err, docs) {
        for (var i = docs.length - 1; i > -1; i -= 1) {
          resultArrayCamera.push(docs[i]);
        }
        for (var i = 0; i < resultArrayCamera.length; i += 3) {
          rev_resultArrayCamera.push(resultArrayCamera.slice(i, i + 3));
          break;
        }
        res.render("home", {
          title: "general",
          productsPinned: rev_resultArrayPinned,
          productsLaptops: rev_resultArrayLaptop,
          productsMobiles: rev_resultArrayMobile,
          productsCameras: rev_resultArrayCamera
        });
      });
    });
});

module.exports = router;
