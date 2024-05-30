/* ============== imports ==============*/
const mongoose = require("mongoose");

/* ============== Schema ==============*/
// 1- create schema
const subCategorySchema = new mongoose.Schema(
  {
    /**
     * @type {mongoose.SchemaDefinitionProperty}
     */
    name: {
      type: String,
      trim: true,
      unique: [true, "Sub-Category must be unique"],
      minlength: [2, "Too short name"],
      maxlength: [32, "Too long name"],
    },
    // for url => replace spaces by _ and uppercase to lower
    slug: {
      type: String,
      lowercase: true,
    },
    // parent
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: [true, "Sub-category must belong to a parent category"]
    },
  },
  { timestamps: true }
);

/* ============== Create model and export ==============*/
module.exports = mongoose.model("subCategory", subCategorySchema);

