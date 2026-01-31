const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllProperties,
  getAllLeases,
  getAllPayments,
  blockUser,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authmiddleware");

const { unblockUser } = require("../controllers/adminController");

router.put("/unblock/:id", unblockUser);

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.get("/properties", getAllProperties);
router.get("/leases", getAllLeases);
router.get("/payments", getAllPayments);
router.put("/block/:id", blockUser);

module.exports = router;
