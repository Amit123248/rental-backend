const express = require("express");
const router = express.Router();

const {
  payRent,
  getOwnerPayments,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

/**
 * TENANT pays rent
 */
router.post(
  "/pay",
  protect,
  authorizeRoles("tenant"),
  payRent
);

/**
 * OWNER views payments
 */
router.get(
  "/owner",
  protect,
  authorizeRoles("owner"),
  getOwnerPayments
);
router.post(
  "/razorpay/order",
  protect,
  authorizeRoles("tenant"),
  createRazorpayOrder
);

router.post(
  "/razorpay/verify",
  protect,
  authorizeRoles("tenant"),
  verifyRazorpayPayment
);


module.exports = router;
