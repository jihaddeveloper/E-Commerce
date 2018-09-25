if (process.env.NODE_ENV === "production") {
    module.exports = {
      mongoURI:
        "mongodb://localhost:27017/e-commerce_db"
    };
  } else {
    module.exports = {
      mongoURI: "mongodb://localhost/e-commerce_db"
    };
  }