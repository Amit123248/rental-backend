const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    rent: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // later Cloudinary URLs
      },
    ],
    isApproved: {
      type: Boolean,
      default: false, // admin must approve
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
