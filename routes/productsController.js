//Imports
const express = require("express");
const router = express.Router();
const {ensureAuthenticated} = require("../helpers/auth");


var multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

// Load Idea model
const Product = require("../models/Product");

//Product register form
router.get("/register", ensureAuthenticated, (req, res) => {
    res.render("products/register");
});

//Product register process
router.post("/registerSave", ensureAuthenticated, upload.single('product_img'), (req, res) => {
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
            imagePath:req.body.product_img
        });
    } else {
        const newProduct = {
            title: req.body.title,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            imagePath: '/images/'+req.file.originalname,
            user: req.user.id
        };
        new Product(newProduct).save().then(product => {
            req.flash("success_msg", "Product added.");
            res.redirect("/home");
        });
    }
  });

// saving data in product schema
router.get('/category/:category',function(req,res,next){
    resultArray=[];
    Product.find({category: req.params.category},function(err,docs){
        for(var i=0; i< docs.length; i+=3){
            resultArray.push(docs.slice(i,i+3));
        }
 
        res.render('index', {title: 'general',category:req.params.category, products: resultArray});
    });
 
 });

module.exports = router;