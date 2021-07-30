const mongoose = require("mongoose");

const tempLiveUserSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TempLiveUser", tempLiveUserSchema);
