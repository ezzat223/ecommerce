/* ============== import ============== */
const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

// for nested routes
const subCategoryRoutes = require("./subCategoryRoutes");

/* ============== create router ==============*/
const router = express.Router();

/* ============== Nested Routes ==============*/
/**
 * @route           GET /api/v1/categories/:categoryId/subcategories
 */
router.use("/:categoryId/subCategories", subCategoryRoutes);

/* ============== Routes ==============*/
router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

/* ============== export ==============*/
module.exports = router;
