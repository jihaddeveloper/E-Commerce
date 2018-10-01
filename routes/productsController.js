//Imports
const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../helpers/auth");
const multer = require('multer');
const Product = require("../models/Product");

//Image save to DB Start
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require("gridfs-stream");
const methodOverride = require('method-override');
const path = require('path');
const crypto = require('crypto');



const mongoURI = 'mongodb://localhost:27017/e-commerce_db';

//Mongo connection
const conn = mongoose.createConnection(mongoURI);

//Init gfs
let gfs;

//Init Stream
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('products');
})

//Storage Engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'products'
                };
                resolve(fileInfo);
            });
            
        });
    }
});

const upload = multer({ storage });
//Image save to DB End


// //Image Path save start
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, './public/images/');
//     },
//     filename: function(req, file, cb){
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({storage: storage});
// //Image Path save end



//Product register form
router.get("/register", ensureAuthenticated, (req, res) => {
    res.render("products/register");
});

//Product register process
router.post("/registerSave", ensureAuthenticated, upload.single('imagePath'), (req, res) => {
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
  });

// Fetching by category data in product schema
router.get('/category/:category',function(req,res,next){
    resultArray=[];
    Product.find({category: req.params.category},function(err,docs){
        for(var i=0; i< docs.length; i+=3){
            resultArray.push(docs.slice(i,i+3));
        }
 
        res.render('index', {title: 'general',category:req.params.category, products: resultArray});
    });
 
 });


// returns home page 
router.get("/home", function(req, res, next) {
    resultArrayLaptop = [];
    resultArrayMobile = [];
    resultArrayCamera = [];
    rev_resultArrayLaptop = [];
    rev_resultArrayMobile = [];
    rev_resultArrayCamera = [];
  
  
    //To fetch image
    

    
    
    Product.find({ category: "laptop" }, function(err, docs) {
      for (var i = docs.length-1; i > -1; i -= 1) {    
        resultArrayLaptop.push(docs[i]);
      }
      for (var i = 0; i < resultArrayLaptop.length; i += 3) {    
        rev_resultArrayLaptop.push(resultArrayLaptop.slice(i,i+3));
        break;
      }
    })
    .then(()=>{
        Product.find({ category: "mobile" }, function(err, docs) {
        for (var i = docs.length-1; i > -1; i -= 1) {    
          resultArrayMobile.push(docs[i]);
        }
        for (var i = 0; i < resultArrayMobile.length; i += 3) {    
          rev_resultArrayMobile.push(resultArrayMobile.slice(i,i+3));
          break;
        }
      });
    })
    .then(()=>{
        Product.find({ category: "camera" }, function(err, docs) {
        for (var i = docs.length-1; i > -1; i -= 1) {    
          resultArrayCamera.push(docs[i]);
        }
        for (var i = 0; i < resultArrayCamera.length; i += 3) {    
          rev_resultArrayCamera.push(resultArrayCamera.slice(i,i+3));
          break;
        }
      });
    })
    .then(()=>{
      res.render("home", {
        title: "general",
        productsLaptops: rev_resultArrayLaptop,
        productsMobiles: rev_resultArrayMobile,
        productsCameras: rev_resultArrayCamera
      });
    })
  });


module.exports = router;