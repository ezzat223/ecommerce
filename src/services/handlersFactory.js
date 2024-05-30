/* ============== import ==============*/
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// ============================================================== //
/**
 * @description     Delete specific document
 */
exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document found for this ${id}`, 404));
    }
    // 204 => No content
    res.status(204).send();
  });

// ============================================================== //
/**
 * @description     Update specific document
 */
exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(
      // {id}, {to update}, {options}
      // { new: true } => return the new document after update
      req.params.id,
      req.body,
      { new: true }
    );

    if (!document) {
      return next(
        new ApiError(`No document found for this ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

// ============================================================== //
/**
 * @description     Create document
 */
exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    // wait
    const document = await model.create(req.body);
    res.status(201).json({ data: document });
  });

// ============================================================== //
/**
 * @description     Get specific document
 */
exports.getOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findById(id);

    if (!document) {
      return next(new ApiError(`No document found for this ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

// ============================================================== //
/**
 * @description     Get list of all documents
 */
exports.getAll = (model) => asyncHandler(async (req, res) => {
    // for nested route of subCategory
    let filter = {};
    if ( req.filterObj ) {
        filter = req.filterObj;
    }

    const documentsCounts = await model.countDocuments();
    // 1- Build query
    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .limitFields()
      .sort()
      .search();
  
    // 2- Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });


