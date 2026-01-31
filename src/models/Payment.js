const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    lease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lease",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String, // e.g. "Jan-2026"
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid",
    },
    paymentMethod: {
      type: String,
      default: "manual",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
