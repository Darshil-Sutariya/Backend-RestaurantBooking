const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: true,
      unique: true 
    },

    capacity: {
      type: Number,
      required: true 
    },

    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available"
    },

    activeBill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
