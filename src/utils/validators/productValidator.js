/* ============== import ============== */
const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");
const brandModel = require("../../models/brandModel");

/* ============== rules ============== */
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  body("title").custom((value, { req }) => {
    if (value) {
      req.body.slug = slugify(value);
    }

    return true;
  }),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Too short Product name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("description")
    .isLength({ max: 3000 })
    .withMessage("Too long Product description")
    .notEmpty()
    .withMessage("Product name is required"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 12 })
    .withMessage("Product price too long"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .isLength({ max: 12 })
    .withMessage("Product priceAfterDiscount too long")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("availableColors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of strings"),
  check("imageCover").notEmpty().withMessage("imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("Invalid category Id format")
    // validate existence of category in categoriesDB
    .custom(async (categoryId, { req }) => {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        throw new Error(`No category for this id: ${categoryId}`);
      }
    }),
  check("subCategories")
    .optional()
    .isArray({ min: 1 })
    .withMessage("SubCategories must be an array with at least one item")
    // validate existence of each subCategory in subCategoriesDB
    .custom(async (subCategoriesIds, { req }) => {
      const existingSubCategories = await subCategoryModel.find({
        _id: { $in: subCategoriesIds },
      });
      if (existingSubCategories.length !== subCategoriesIds.length) {
        throw new Error("One or more subCategories do not exist");
      }
    })
    // Ensure that all subCategories belong to that category
    .custom(async (val, { req }) => {
      await subCategoryModel
        .find({ category: req.body.category })
        .then((subCategories) => {
          const subCategoriesIdsInDB = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          if (!val.every((v) => subCategoriesIdsInDB.includes(v))) {
            throw new Error(
              "One or more subCategories do not belong to category"
            );
          }
        });
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand Id format")
    .custom(async (brandId, { req }) => {
      const brand = await brandModel.findById(brandId);
      if (!brand) {
        throw new Error(`No brand for this id: ${brandId}`);
      }
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("Rating must be less than or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];
