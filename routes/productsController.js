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
//Image Path save start
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });
//mobile and camera registration form
router.get("/reg/:category", ensureAuthenticated, (req, res) => {
  var cat = req.params.category;

  var mobile = false;
  var camera = false;

  if (cat === 'mobile') {
    mobile = true;
  }
  if (cat === 'camera') {
    camera = true;
  }
  res.render("products/registration_phone_camera", { mobile: mobile, camera: camera, category: cat });
});


//Product registration form
router.get("/register/:category", ensureAuthenticated, (req, res) => {
  var cat = req.params.category;
  var laptop = false;
  var mobile = false;
  var camera = false;
  var parent = false;
  var processor = false;
  var customPC = false;
  var allInOnePC = false;
  var mainBoard = false;
  if (cat === 'laptop') {
    laptop = true;
    parent = true;
  }
  if (cat === "allInOnePC") {
    allInOnePC = true;
    parent = true;
  }
  if (cat === "customPC") {
    allInOnePC = true;
    customPC = true;
    parent = true;
  }
  if (cat === 'processor') {
    processor = true;
  }
  if (cat === 'mainBoard') {
    mainBoard = true;
  }
  if (cat === 'mobile') {
    mobile = true;
  }
  if (cat === 'camera') {
    camera = true;
  }
  res.render("products/register", { mainBoard: mainBoard, laptop: laptop, mobile: mobile, camera: camera, allInOnePC: allInOnePC, parent: parent, category: cat, customPC: customPC, processor: processor });
});

//modile camera registration
router.post("/regSave/:category", ensureAuthenticated, upload.single("imagePath"), (req, res) => {
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
  if (errors.length > 0) {
    res.render("products/register", {
      errors: errors,
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,
      // imagePath: req.body.imagePath
    });
  } else {
    console.log(req.user.id);
    var type = req.params.category;
    if (type === "mobile") {
      var newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        imagePath: ",,,,,,,,ghfgdh",
        // "/images/"+ req.file.originalname,
        user: req.user.id,
        brand: req.body.brand,
        model: req.body.model,
        warranty: req.body.warranty,

        effectivePixels: req.body.effectivePixels,
        lens: req.body.lens,
        sensorType: req.body.sensorType,
        sensorSize: req.body.sensorSize,
        touchScreen: req.body.touchScreen,
        screenDots: req.body.screenDots,
        imageRes: req.body.imageRes,
        imageRatioWH: req.body.imageRatioWH,
        videoRes: req.body.videoRes,
        videoFormat: req.body.videoFormat,
        playbackZoom: req.body.playbackZoom,
        iso: req.body.iso,
        isoMaximum: req.body.isoMaximum,
        shutterSpeed: req.body.shutterSpeed,
        autofocusAssistLamp: req.body.autofocusAssistLamp,
        manualFocus: req.body.manualFocus,
        numberOfFocusPoints: req.body.numberOfFocusPoints,
        liveView: req.body.liveView,
        viewfinderType: req.body.viewfinderType,
        viewfinderCoverage: req.body.viewfinderCoverage,
        builtinflash: req.body.builtinflash,
        flashRange: req.body.flashRange,
        externalFlash: req.body.externalFlash,
        flashXSyncSpeed: req.body.flashXSyncSpeed,
        faceDetection: req.body.faceDetection,
        redEyeDetection: req.body.redEyeDetection,
        digitalZoom: req.body.digitalZoom,
        microphone: req.body.microphone,

        memoryType: req.body.memoryType,
        usb: req.body.usb,
        hdmiPort: req.body.hdmiPort,
        wirelessTechnology: req.body.wirelessTechnology,
        remoteControl: req.body.remoteControl,
        battery: req.body.battery,
        bodyDimension: req.body.bodyDimension,
        weight: req.body.weight,
        specialty: req.body.specialty,
        compatibleLenses: req.body.compatibleLenses,
        productRange: req.body.productRange,

        releaseDate: req.body.releaseDate

      };
    }
    new Product(newProduct).save().then(product => {
      req.flash("success_msg", "Product added.");
      res.redirect("/products/home");
    });
  }
});

//Product register process
router.post("/registerSave/:category", ensureAuthenticated, upload.single("imagePath"), (req, res) => {
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
  if (errors.length > 0) {
    res.render("products/register", {
      errors: errors,
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,
      // imagePath: req.body.imagePath
    });
  } else {
    var type = req.params.category;
   
    if (type === "laptop") {
      console.log(req.params.category);
      var newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        imagePath: ",,,,,,,,ghfgdh",
        // "/images/"+ req.file.originalname,
        user: req.user.id,
        brand: req.body.brand,
        model: req.body.model,

        // laptop
        precessor: req.body.precessor,
        clockSpeed: req.body.clockSpeed,
        cache: req.body.cache,
        displayType: req.body.displayType,
        displayResolution: req.body.displayResolution,
        touch: req.body.touch,
        RAM_type: req.body.RAM_type,
        RAM: req.body.RAM,
        storage: req.body.storage,
        graphicsChipset: req.body.graphicsChipset,
        graphicsMemory: req.body.graphicsMemory,
        opticalDevice: req.body.opticalDevice,
        networking: req.body.networking,
        displayPort: req.body.displayPort,
        audioPort: req.body.audioPort,
        USB_Port: req.body.USB_Port,
        battery: req.body.battery,
        weight: req.body.weight,
        color: req.body.color,
        operatingSystem: req.body.operatingSystem,
        partNo: req.body.partNo,
        warranty: req.body.warranty,
        generation: req.body.generation,
        displaySize: req.body.displaySize
      };
    }

    else if (type === "customPC") {

      var newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        imagePath: ",,,,,,,,ghfgdh",
        // "/images/"+ req.file.originalname,
        user: req.user.id,
        brand: req.body.brand,
        model: req.body.model,
        warranty: req.body.warranty,

        // laptop
        precessor: req.body.precessor,
        clockSpeed: req.body.clockSpeed,
        cache: req.body.cache,
        displayType: req.body.displayType,
        displayResolution: req.body.displayResolution,
        touch: req.body.touch,
        RAM_type: req.body.RAM_type,
        RAM: req.body.RAM,
        storage: req.body.storage,
        graphicsChipset: req.body.graphicsChipset,
        graphicsMemory: req.body.graphicsMemory,
        opticalDevice: req.body.opticalDevice,
        networking: req.body.networking,
        displayPort: req.body.displayPort,
        audioPort: req.body.audioPort,
        USB_Port: req.body.USB_Port,
        // battery:req.body.battery,
        // weight:req.body.weight,
        color: req.body.color,
        operatingSystem: req.body.operatingSystem,
        partNo: req.body.partNo,

        generation: req.body.generation,
        displaySize: req.body.displaySize,
        chipset: req.body.chipset,
        storageType: req.body.storageType,

        monitor: req.body.monitor,
        speaker: req.body.speaker,
        keyboard: req.body.keyboard,
        mouse: req.body.mouse,
        casing: req.body.casing,
        others: req.body.others


      };
    }
    else if (type === "processor") {
      console.log(req.body.baseFrequency);
      var newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        imagePath: ",,,,,,,,ghfgdh",
        // "/images/"+ req.file.originalname,
        user: req.user.id,
        brand: req.body.brand,
        model: req.body.model,
        warranty: req.body.warranty,
        generation: req.body.generation,

        baseFrequency: req.body.baseFrequency,
        turboFrequencyMax: req.body.turboFrequencyMax,
        core: req.body.core,
        thread: req.body.thread,
        smartCache: req.body.smartCache,
        busSpeed: req.body.busSpeed,
        tdp: req.body.tdp,
        lithography: req.body.lithography,
        memoryMax: req.body.memoryMax,
        memoryType: req.body.memoryType,
        memoryChannel: req.body.memoryChannel,
        socketsSupport: req.body.socketsSupport,
        specialty: req.body.specialty,
        compatibleProducts: req.body.compatibleProducts
      };

    }
    else if (type === "allInOnePC") {
      console.log(req.body.displayResolution);
      var newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        imagePath: ",,,,,,,,ghfgdh",
        // "/images/"+ req.file.originalname,
        user: req.user.id,
        brand: req.body.brand,
        model: req.body.model,
        warranty: req.body.warranty,
        precessor: req.body.precessor,
        clockSpeed: req.body.clockSpeed,
        cache: req.body.cache,
        displayType: req.body.displayType,
        displayResolution: req.body.displayResolution,
        touch: req.body.touch,
        RAM_type: req.body.RAM_type,
        RAM: req.body.RAM,
        storage: req.body.storage,
        graphicsChipset: req.body.graphicsChipset,
        graphicsMemory: req.body.graphicsMemory,
        opticalDevice: req.body.opticalDevice,
        networking: req.body.networking,
        displayPort: req.body.displayPort,
        audioPort: req.body.audioPort,
        USB_Port: req.body.USB_Port,
        color: req.body.color,
        operatingSystem: req.body.operatingSystem,
        partNo: req.body.partNo,
        generation: req.body.generation,
        displaySize: req.body.displaySize,
        chipset: req.body.chipset,
        storageType: req.body.storageType,
        monitor: req.body.monitor,
        speaker: req.body.speaker,
        keyboard: req.body.keyboard,
        mouse: req.body.mouse
      };
    }
    else if (type === "mainBoard") {


      var newProduct = {
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        imagePath: ",,,,,,,,ghfgdh",

        user: req.user.id,
        brand: req.body.brand,
        model: req.body.model,
        warranty: req.body.warranty,

        formFactor: req.body.formFactor,
        chipset: req.body.chipset,
        supportedCPU: req.body.supportedCPU,
        ramType: req.body.ramType,
        ramBus: req.body.ramBus,
        ramMax: req.body.ramMax,
        ramSlot: req.body.ramSlot,
        pciExpressx16Slot: req.body.pciExpressx16Slot,
        sataPort: req.body.sataPort,
        audioChipset: req.body.audioChipset,
        audioChannel: req.body.audioChannel,
        lanChipset: req.body.lanChipset,
        lanSpeed: req.body.lanSpeed,
        interfaceUSB: req.body.interfaceUSB,
        usbPort: req.body.usbPort,
        vgaPort: req.body.vgaPort,
        dviPort: req.body.dviPort
      };

    }
    else {

    }
    new Product(newProduct).save().then(product => {
      req.flash("success_msg", "Product added.");
      res.redirect("/products/home");
    });
  }
});

// Fetching by category data in product schema
router.get("/category/:category", function (req, res, next) {
  resultArray = [];
  Product.find({ category: req.params.category }, function (err, docs) {
    for (var i = 0; i < docs.length; i += 4) {
      resultArray.push(docs.slice(i, i + 4));
    }
    res.render("categoryWise", {
      title: "general",
      category: req.params.category,
      products: resultArray
    });
  });
});



// saving data in product schema
router.get("/view", function (req, res, next) {
  resultArray = [];
  Product.find(function (err, docs) {
    for (var i = docs.length - 1; i > -1; i -= 1) {
      resultArray.push(docs[i]);
    }
    res.render("allProductView", { title: "general", products: resultArray });
  });
});

// pin the product to top
router.get("/pin/:id", function (req, res, next) {
  console.log(req.params.id);
  Product.update(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: { pinned: "true" }
    },
    function (err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/products/view");
      }
    }
  );
});

// unpin the product to top
router.get("/unpin/:id", function (req, res, next) {
  console.log(req.params.id);
  Product.update(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: { pinned: "" }
    },
    function (err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/products/view");
      }
    }
  );
});

// Add to home page
router.get("/home/:id", function (req, res, next) {
  console.log(req.params.id);
  Product.update(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: { home: "true" }
    },
    function (err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/products/view");
      }
    }
  );
});

// remove from home page
router.get("/unhome/:id", function (req, res, next) {
  console.log(req.params.id);
  Product.update(
    { _id: mongo.ObjectID(req.params.id) },
    {
      $set: { home: "" }
    },
    function (err, bear) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/products/view");
      }
    }
  );
});

// delete product
router.get("/delete/:id", function (req, res, next) {
  Product.deleteOne({ _id: mongo.ObjectID(req.params.id) }, function (
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
router.post("/search", function (req, res, next) {
  var txt = req.body.key_text;
  var resultArray = [];

  Product.find({ $or: [{ category: txt.toLowerCase() }, { title: txt.toLowerCase() }] }, function (err, docs) {
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

// returns home page
router.get("/home", function (req, res, next) {
  resultArrayLaptop = [];
  resultArrayMobile = [];
  resultArrayCamera = [];
  resultArrayPinned = [];
  rev_resultArrayLaptop = [];
  rev_resultArrayMobile = [];
  rev_resultArrayCamera = [];
  rev_resultArrayPinned = [];
  var p = req.params.p;

  Product.find({ category: "laptop", home: "true" }, function (err, docs) {
    for (var i = docs.length - 1; i > -1; i -= 1) {
      resultArrayLaptop.push(docs[i]);
    }
    for (var i = 0; i < resultArrayLaptop.length; i += 4) {
      rev_resultArrayLaptop.push(resultArrayLaptop.slice(i, i + 4));
      break;
    }
  })
    .then(() => {
      Product.find({ pinned: "true" }, function (err, docs) {
        for (var i = docs.length - 1; i > -1; i -= 1) {
          resultArrayPinned.push(docs[i]);
        }
        for (var i = 0; i < resultArrayPinned.length; i += 4) {
          rev_resultArrayPinned.push(resultArrayPinned.slice(i, i + 4));
          break;
        }
      });
    })
    .then(() => {
      Product.find({ category: "mobile", home: "true" }, function (err, docs) {
        for (var i = docs.length - 1; i > -1; i -= 1) {
          resultArrayMobile.push(docs[i]);
        }
        for (var i = 0; i < resultArrayMobile.length; i += 4) {
          rev_resultArrayMobile.push(resultArrayMobile.slice(i, i + 4));
          break;
        }
      });
    })
    .then(() => {
      Product.find({ category: "camera", home: "true" }, function (err, docs) {
        for (var i = docs.length - 1; i > -1; i -= 1) {
          resultArrayCamera.push(docs[i]);
        }
        for (var i = 0; i < resultArrayCamera.length; i += 4) {
          rev_resultArrayCamera.push(resultArrayCamera.slice(i, i + 4));
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
