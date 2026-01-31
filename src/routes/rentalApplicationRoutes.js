const express = require("express");
const router = express.Router();

const {
  applyForProperty,
  getOwnerApplications,
  updateApplicationStatus,
} = require("../controllers/rentalApplicationController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

/**
 * TENANT applies
 */
router.post(
  "/apply/:propertyId",
  protect,
  authorizeRoles("tenant"),
  applyForProperty
);

/**
 * OWNER views applications
 */
router.get(
  "/owner",
  protect,
  authorizeRoles("owner"),
  getOwnerApplications
);

/**
 * OWNER approves / rejects
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("owner"),
  updateApplicationStatus
);

module.exports = router;
