if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: "mongodb://localhost:27017/e-commerce"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/e-commerce"
  };
}

//Local MongoDB
//"mongoURI: "mongodb://localhost:27017/e-commerce_db"
//"mongoURI: "mongodb://localhost/e-commerce_db"

// MLab MongoDB
//"mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db"