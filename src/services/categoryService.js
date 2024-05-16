/* ============================ Business Logic ============================ */
/* ============== import ==============*/
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");



/* ============== Services ============== */
/**
 * @description     Get list of all categories
 * @route           GET /api/v1/categories
 * @access          Public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  // Multiply by 1 to make it a number | ?page=1&limit=4
  const page = req.query.page * 1 || 1;
  // Number of items per page
  const limit = req.query.limit * 1 || 5;
  // Number of items to be skipped to reach this page
  const skip = (page - 1) * limit;

  const categories = await categoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// ============================================================== //
/**
 * @description     Get specific category by id
 * @route           GET /api/v1/categories/:id
 * @access          Public
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id);

  if (!category) {
    return next(new ApiError(`No category found for this ${id}`, 404));
  };
  res.status(200).json({ data: category });
});

// ============================================================== //
/**
 * @description     Create category
 * @route           POST /api/v1/categories
 * @access          Private
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  // wait
  const category = await categoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// ============================================================== //
/**
 * @description     Update specific category
 * @route           PUT /api/v1/categories
 * @access          Private
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await categoryModel.findOneAndUpdate(
    // {id}, {to update}, {options}
    // { new: true } => return the new category after update
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    return next(new ApiError(`No category found for this ${id}`, 404));
  };
  res.status(200).json({ data: category });
});

// ============================================================== //
/**
 * @description     Delete specific category
 * @route           DELETE /api/v1/categories
 * @access          Private
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category found for this ${id}`, 404));
  };
  // 204 => No content
  res.status(204).send();
});
