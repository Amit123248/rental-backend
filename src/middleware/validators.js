const { body } = require("express-validator");

exports.registerValidator = [
  body("name").notEmpty().withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
];

exports.propertyValidator = [
  body("title").notEmpty(),
  body("rent").isNumeric(),
  body("location").notEmpty(),
];
