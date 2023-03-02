// external import
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: [true, "Please enter product Id"],
      minlength: [5, "Product id at least 5 character"],
      maxlangth: [8, "Product id at most 8 character"],
      unique: true,
      trim: true,
    },
    productname: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
    },
    demoprice: {
      type: Number,
    },
    brand: {
      type: String,
      required: [true, "Please enter product brand"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please enter product image"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please enter product category"],
      trim: true,
    },
    subcategory: {
      type: String,
      required: [true, "Please enter product subcategory"],
      trim: true,
      lowercase:true
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
