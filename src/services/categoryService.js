/* ============================ Business Logic ============================ */
/* ============== import ==============*/
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
// generate random id
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')

const categoryModel = require("../models/categoryModel");


const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require("./handlersFactory");

/* ============== Images ============== */
// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// resize Images
exports.resizeImage = asyncHandler(async (req, res, next) => {
  // Ensure the destination directory exists, create it if it doesn't
  const destinationDir = "./src/uploads/categories";
  fs.mkdirSync(destinationDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating destination directory:", err);
    }
  });

  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  //   use sharp
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    // makes quality only 90 percent of original one
    .jpeg({ quality: 95 })
    .toFile(`${destinationDir}/${filename}`);

  // save image into our db
  req.body.image = filename;

  next();
});


/* ============== Services ============== */
/**
 * @description     Get list of all categories
 * @route           GET /api/v1/categories
 * @access          Public
 */
exports.getCategories = getAll(categoryModel);

// ============================================================== //
/**
 * @description     Get specific category by id
 * @route           GET /api/v1/categories/:id
 * @access          Public
 */
exports.getCategory = getOne(categoryModel);

// ============================================================== //
/**
 * @description     Create category
 * @route           POST /api/v1/categories
 * @access          Private
 */
exports.createCategory = createOne(categoryModel);

// ============================================================== //
/**
 * @description     Update specific category
 * @route           PUT /api/v1/categories/:id
 * @access          Private
 */
exports.updateCategory = updateOne(categoryModel);

// ============================================================== //
/**
 * @description     Delete specific category
 * @route           DELETE /api/v1/categories/:id
 * @access          Private
 */
exports.deleteCategory = deleteOne(categoryModel);
