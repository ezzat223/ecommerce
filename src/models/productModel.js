/* ============== imports ==============*/
const mongoose = require("mongoose");

/* ============== Schema ==============*/
// 1- create schema
const productSchema = new mongoose.Schema(
  {
    /**
     * @type {mongoose.SchemaDefinitionProperty}
     */
    title: {
      type: String,
      trim: true,
      required: [true, "product required"],
      unique: [true, "product must be unique"],
      minlength: [3, "Too short product name"],
      maxlength: [100, "Too long product title"],
    },
    // for url => replace spaces by _ and uppercase to lower
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Product desc required"],
      minlength: [3, "Too short product desc"],
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity required"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Product price required"],
      trim: true,
      maxlength: [9, "Too long product price"],
    },

    priceAfterDiscount: {
      type: Number,
      trim: true,
      maxlength: [9, "Too long product price"],
    },

    availableColors: [String],

    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },

    images: [String],

    // ======================================== //
    // must at least belong to a main category
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Product must belong to category"],
    },
    // you can choose more than subcategory
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    // ======================================== //
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1"],
      max: [5, "Rating must be less than or equal 5"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  // adds created at and updated at
  { timestamps: true }
);

/* ================= Mongoose query Middleware ================= */
// use Regex to populate 
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

// 2- create model and export
module.exports = mongoose.model("product", productSchema);
