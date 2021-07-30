const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    coin: Number,
    rupee: Number,
    googleProductId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("plan", planSchema);
