var mongooose = require('mongoose');
var Schema = mongooose.Schema;

var schema =new Schema({
    imagePath: {type:String, required: true},
    title: {type:String, required: true},
    description: {type:String, required: true},
    price: {type: Number , required: true}
       
});
module.exports = mongooose.model('Product', schema);