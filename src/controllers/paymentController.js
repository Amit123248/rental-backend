const Payment = require("../models/Payment");
const Lease = require("../models/Lease");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

/**
 * TENANT pays rent (manual MVP)
 */
exports.payRent = async (req, res) => {
  try {
    const { amount, month } = req.body;

    const lease = await Lease.findOne({
      tenant: req.user._id,
      status: "active",
    });

    if (!lease)
      return res.status(404).json({ message: "Active lease not found" });

    const payment = await Payment.create({
      lease: lease._id,
      tenant: lease.tenant,
      owner: lease.owner,
      amount,
      month,
    });

    res.status(201).json({
      message: "Rent payment recorded",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * OWNER views payments
 */
exports.getOwnerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ owner: req.user._id })
      .populate("tenant", "name email")
      .populate("lease", "rentAmount");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // INR paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      month,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const lease = await Lease.findOne({
      tenant: req.user._id,
      status: "active",
    });

    const payment = await Payment.create({
      lease: lease._id,
      tenant: lease.tenant,
      owner: lease.owner,
      amount,
      month,
      paymentMethod: "razorpay",
      status: "paid",
    });

    res.json({
      message: "Payment verified & saved",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

