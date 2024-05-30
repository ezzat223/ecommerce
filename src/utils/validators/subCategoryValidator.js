/* ============== import ============== */
const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

/* ============== rules ============== */
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  body("name").custom((value, { req }) => {
    if (value) {
      req.body.slug = slugify(value);
    }

    return true;
  }),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Sub-Category name is required")
    .isLength({ min: 2 })
    .withMessage("Too short Sub-Category name")
    .isLength({ max: 32 })
    .withMessage("Too long Sub-Category name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Sub-Category must belong to a parent category.")
    .isMongoId()
    .withMessage("Invalid Sub-Category id format"),
  validatorMiddleware,
];
