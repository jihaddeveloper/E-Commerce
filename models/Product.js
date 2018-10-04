const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  imagePath:{type: String,required:true},
  user: { type: String, required: true},
  pinned:{ type:String, required: false},
  home:{ type:String, required: false},

  // laptop,mobile,cameras
  brand:{ type: String, required: true },
  model:{ type: String, required: true },

  // laptop
  precessor:{ type: String, required: true },
  clockSpeed:{ type: String, required: true },
  cache:{ type: String, required: true },
  displayType:{ type: String, required: true },
  displayResolution:{ type: String, required: true },
  touch:{ type: String, required: true },
  RAM_type:{ type: String, required: true },
  RAM:{ type: String, required: true },
  storage:{ type: String, required: true },
  graphicsChipset:{ type: String, required: true },
  graphicsMemory:{ type: String, required: true },
  opticalDevice:{ type: String, required: true },
  networking:{ type: String, required: true },
  displayPort:{ type: String, required: true },
  audioPort:{ type: String, required: true },
  USB_Port:{ type: String, required: true },
  battery:{ type: String, required: true },
  weight:{ type: String, required: true },
  color:{ type: String, required: true },
  operatingSystem:{ type: String, required: true },
  others:{ type: String, required: true },
  partNo:{ type: String, required: true },
  warranty:{ type: String, required: true },
  generation:{ type: String, required: true },
  displaySize:{ type: String, required: true }

  // mobile
 
});

module.exports = mongoose.model('products', productSchema, 'products');