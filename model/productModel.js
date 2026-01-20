const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        productname: {
            type: String,
            require: true,
            unique: true
        },
        productdiscription: {
            type: String
        },
        productprice: {
            type: Number,
            require: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category", 
            required: true
        },
        productimage: {
            type: String,
            require: true
        },
         createdBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              default: null
            },
            updatedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              default: null
            },
            deletedBy: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              default: null
            },
        
            deletedAt: {
              type: Date,
              default: null
            }
    },{timestamps:true}
);

module.exports = mongoose.model("product", productSchema);