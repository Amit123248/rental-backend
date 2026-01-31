const express = require("express");
const router = express.Router();

const {
  createMaintenanceRequest,
  getOwnerMaintenanceRequests,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

/**
 * TENANT creates request
 */
router.post(
  "/",
  protect,
  authorizeRoles("tenant"),
  createMaintenanceRequest
);

/**
 * OWNER views requests
 */
router.get(
  "/owner",
  protect,
  authorizeRoles("owner"),
  getOwnerMaintenanceRequests
);

/**
 * OWNER updates status
 */
router.put(
  "/:id",
  protect,
  authorizeRoles("owner"),
  updateMaintenanceStatus
);

module.exports = router;
