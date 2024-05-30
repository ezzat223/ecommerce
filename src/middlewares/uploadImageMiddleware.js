/* ============== Imports ============== */
const ApiError = require("../utils/apiError");

// for images
const multer = require("multer");



/* ============== Images ============== */
exports.uploadSingleImage = (fieldName) => {
  // MemoryStorage Engine
  const multerStorage = multer.memoryStorage();

  // filter only images
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  // returns a middleware
  return upload.single(fieldName);
};
