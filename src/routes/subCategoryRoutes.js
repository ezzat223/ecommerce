/* ============== import ============== */
const express = require("express");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const {
  getSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryId,
  createFilterObj
} = require("../services/subCategoryService");

/* ============== create router ==============*/
/**
 * mergeParams: true => for nested routes => /api/v1/categories/:categoryId/subcategories
 *     means => Allows us to access params in other routers
 *          like accessing categoryId in category router
 */
const router = express.Router({ mergeParams: true });

/* ============== Routes ==============*/
router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(setCategoryId, createSubCategoryValidator, createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

/* ============== export ==============*/
module.exports = router;
