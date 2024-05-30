/* ============================ Business Logic ============================ */
/* ============== import ==============*/
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
// generate random id
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')

const brandModel = require("../models/brandModel");
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlersFactory');



/* ============== Images ============== */
// upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// resize Images
exports.resizeImage = asyncHandler(async (req, res, next) => {
  // Ensure the destination directory exists, create it if it doesn't
  const destinationDir = "./src/uploads/brands";
  fs.mkdirSync(destinationDir, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating destination directory:", err);
    }
  });

  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

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
 * @description     Get list of all brands
 * @route           GET /api/v1/brands
 * @access          Public
 */
exports.getBrands = getAll(brandModel);

// ============================================================== //
/**
 * @description     Get specific brand by id
 * @route           GET /api/v1/brands/:id
 * @access          Public
 */
exports.getBrand = getOne(brandModel);


// ============================================================== //
/**
 * @description     Create brand
 * @route           POST /api/v1/brands
 * @access          Private
 */
exports.createBrand = createOne(brandModel);


// ============================================================== //
/**
 * @description     Update specific brand
 * @route           PUT /api/v1/brands
 * @access          Private
 */
exports.updateBrand = updateOne(brandModel);

// ============================================================== //
/**
 * @description     Delete specific brand
 * @route           DELETE /api/v1/brands/:id
 * @access          Private
 */
exports.deleteBrand = deleteOne(brandModel);
