/* ============== imports ==============*/
const mongoose = require("mongoose");

/* ============== Schema ==============*/
// 1- create schema
const categorySchema = new mongoose.Schema(
  {
    /**
     * @type {mongoose.SchemaDefinitionProperty}
     */
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    // for url => replace spaces by _ and uppercase to lower
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
    // adds created at and updated at
  },
  { timestamps: true }
);

// 2- create model
const categoryModel = mongoose.model("Category", categorySchema);

/* ============== export ==============*/
module.exports = categoryModel;
