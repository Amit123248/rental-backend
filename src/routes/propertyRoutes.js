const express = require("express");
const router = express.Router();

const {
  createProperty,
  approveProperty,
  getApprovedProperties,
} = require("../controllers/propertyController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authmiddleware");

/**
 * OWNER creates property
 */
router.post(
  "/",
  protect,
  authorizeRoles("owner"),
  createProperty
);

/**
 * ADMIN approves property
 */
router.put(
  "/approve/:id",
  protect,
  authorizeRoles("admin"),
  approveProperty
);

/**
 * TENANT views approved properties
 */
router.get(
  "/approved",
  protect,
  authorizeRoles("tenant", "owner"),
  getApprovedProperties
);

module.exports = router;
