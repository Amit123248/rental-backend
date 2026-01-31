const express = require("express");
const router = express.Router();

const {
  createLease,
  getTenantLease,
} = require("../controllers/leaseController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authmiddleware");

/**
 * OWNER creates lease
 */
router.post(
  "/",
  protect,
  authorizeRoles("owner"),
  createLease
);

/**
 * TENANT views lease
 */
router.get(
  "/tenant",
  protect,
  authorizeRoles("tenant"),
  getTenantLease
);

module.exports = router;
