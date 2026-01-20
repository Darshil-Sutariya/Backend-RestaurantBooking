const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        productName: String,
        quantity: Number,
        productImg: String,
        price: Number,
        total: Number
      }
    ],

    grandTotal: Number,

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
