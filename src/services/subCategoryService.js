/* ============================ Business Logic ============================ */
/* ============== import ==============*/
const subCategoryModel = require("../models/subCategoryModel");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlersFactory");

/* ============== Services ============== */
/**
 * @description     Create category
 * @route           POST /api/v1/subcategories
 * @access          Private
 */
// A middleware for nested route => create subcategory on category To add category to req body
exports.setCategoryId = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = createOne(subCategoryModel);

// exports.createSubCategory = asyncHandler(async (req, res) => {
//   const { name, category } = req.body;
//   // wait
//   const subCategory = await subCategoryModel.create({
//     name,
//     slug: slugify(name),
//     category,
//   });
//   res.status(201).json({ data: subCategory });
// });

// ============================================================== //
/**
 * @description     Get list of all subcategories
 * @route           GET /api/v1/subcategories
 * @access          Public
 */
// A middleware for nested route => To filter subcategories on category
// @route           GET /api/v1/categories/:categoryId/subcategories   [Nested Route]
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
exports.getSubCategories = getAll(subCategoryModel);

// ============================================================== //
/**
 * @description     Get specific subcategory by id
 * @route           GET /api/v1/subcategories/:id
 * @access          Public
 */
exports.getSubCategory = getOne(subCategoryModel);

// ============================================================== //
/**
 * @description     Update specific sub-category
 * @route           PUT /api/v1/subcategories/:id
 * @access          Private
 */
exports.updateSubCategory = updateOne(subCategoryModel);

// ============================================================== //
/**
 * @description     Delete specific subcategory
 * @route           DELETE /api/v1/subcategories/:id
 * @access          Private
 */
exports.deleteSubCategory = deleteOne(subCategoryModel);
