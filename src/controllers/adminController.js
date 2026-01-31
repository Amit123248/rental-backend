const User = require("../models/User");
const Property = require("../models/Property");
const Lease = require("../models/Lease");
const Payment = require("../models/Payment");

/**
 * ADMIN: Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN: Get all properties
 */
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN: Get all leases
 */
exports.getAllLeases = async (req, res) => {
  try {
    const leases = await Lease.find()
      .populate("tenant", "name email")
      .populate("owner", "name email")
      .populate("property", "title location");
    res.json(leases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN: Get all payments (Revenue)
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("tenant", "name email")
      .populate("owner", "name email");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ADMIN: Block user
 */
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isBlocked = true;
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
