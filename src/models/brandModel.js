/* ============== imports ==============*/
const mongoose = require("mongoose");

/* ============== Schema ==============*/
// 1- create schema
const brandSchema = new mongoose.Schema(
  {
    /**
     * @type {mongoose.SchemaDefinitionProperty}
     */
    name: {
      type: String,
      trim: true,
      required: [true, "brand required"],
      unique: [true, "brand must be unique"],
      minlength: [3, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
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

// 2- create model and export
module.exports = mongoose.model("brand", brandSchema);
