const mongoose = require("mongoose");

const leaseSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lease", leaseSchema);
