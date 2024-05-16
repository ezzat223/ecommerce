/* ============== import ============== */
const { validationResult } = require("express-validator");


/********************************
 * @description finds validation errors in the request and wraps them in an object with a handy function
*/
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  };
  next();
};

/* ============== export ============== */
module.exports = validatorMiddleware;