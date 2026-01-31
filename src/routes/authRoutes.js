const express = require("express");
const router = express.Router();
const { registerValidator } = require("../middleware/validators");
const validate = require("../middleware/validate");
const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post(
  "/register",
  registerValidator,
  validate,
  registerUser
);

module.exports = router;
