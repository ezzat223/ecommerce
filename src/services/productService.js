/* ============================ Business Logic ============================ */
/* ============== import ==============*/
const productModel = require("../models/productModel");
const { deleteOne, updateOne, createOne, getOne, getAll } = require('./handlersFactory');


/* ============== Services ============== */
/**
 * @description     Get list of all products
 * @route           GET /api/v1/products
 * @access          Public
 */
exports.getProducts = getAll(productModel);

// ============================================================== //
/**
 * @description     Get specific product by id
 * @route           GET /api/v1/products/:id
 * @access          Public
 */
exports.getProduct = getOne(productModel);

// ============================================================== //
/**
 * @description     Create product
 * @route           POST /api/v1/products
 * @access          Private
 */
exports.createProduct = createOne(productModel);

// ============================================================== //
/**
 * @description     Update specific product
 * @route           PUT /api/v1/products/:id
 * @access          Private
 */
exports.updateProduct = updateOne(productModel);

// ============================================================== //
/**
 * @description     Delete specific product
 * @route           DELETE /api/v1/products/:id
 * @access          Private
 */
exports.deleteProduct = deleteOne(productModel);
