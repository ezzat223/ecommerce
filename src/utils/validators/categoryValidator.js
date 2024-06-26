/* ============== import ============== */
const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

/* ============== rules ============== */
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  body("name").custom((value, { req }) => {
    if (value) {
      req.body.slug = slugify(value);
    }
    return true;
  }),
  validatorMiddleware,
];


exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    // to slugify
    .custom((value, { req }) => {
      req.body.slug = slugify(value);

      return true;
    }),
  validatorMiddleware,
];
