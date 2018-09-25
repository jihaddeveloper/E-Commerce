const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('products', productSchema, 'products');