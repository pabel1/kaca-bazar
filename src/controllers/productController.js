const Product = require("../models/productModel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const csv = require("csvtojson");
const ErrorHandler = require("../utility/ErrorHandler");
const path = require("path");
const { match } = require("assert");

// Create new product -- ADMIN
exports.createSingleProduct = catchAsyncError(async (req, res, next) => {
  const {
    productId,
    productname,
    description,
    price,
    discountprice,
    brand,
    image,
    category,
    subcategory,
    stock,
  } = req.body;
  if (
    !productId ||
    !productname ||
    !description ||
    !price ||
    !brand ||
    !image ||
    !category ||
    !subcategory ||
    !stock
  ) {
    return next(new ErrorHandler("Please fill the required field", 400));
  }
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: product,
  });
});

// Create multiple products -- ADMIN
exports.uploadProducts = catchAsyncError(async (req, res, next) => {
  if (req.files === null) {
    return next(new ErrorHandler("No file Uploaded", 400));
  }
  const file = req.files.csvfile;
  const replacedfilename = file.name.replace(
    file.name.split(".")[0],
    "products"
  );
  file.mv(`${__dirname}/../uploads/${replacedfilename}`, (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler(err.message, 500));
    }
  });
  const jsonObject = await csv().fromFile(
    `${__dirname}/../uploads/products.csv`
  );
  var isOK = true;
  const allproducts = await Product.find();
  jsonObject.forEach((obj) => {
    const productExist = allproducts.find(
      (value) => value.productId === obj.productId
    );
    if (productExist) {
      isOK = false;
    }
  });
  if (!isOK) {
    return next(new ErrorHandler("Product Already Exist is the database", 409));
  } else {
    jsonObject.forEach((product) => {
      product.productId = parseInt(product.productId);
      product.price = parseInt(product.price);
      product.demoprice = parseInt(product.demoprice);
      product.stock = parseInt(product.stock);
    });
    const products = await Product.create(jsonObject);
    res.status(200).json({
      success: true,
      message: "Products Uploaded Successfully",
      products,
    });
  }
});

// Get all products
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    message: "Product gets successfully",
    products: products,
  });
});

// Get all products
exports.getAllProductsPagination = catchAsyncError(async (req, res, next) => {
  let pageno = Number(req.params.page) || 1;
  let perpage = Number(req.params.limit) || 10;

   let skipRow = (pageno - 1) * perpage;
  const products = await Product.find().skip(skipRow).limit(perpage);
  res.status(200).json({
    success: true,
    message: "Product gets successfully",
    products: products,
  });
});

// query filter
exports.getAllProductsByCategorySub = catchAsyncError(
  async (req, res, next) => {
    let pageno = Number(req.params.page) || 1;
    let perpage = Number(req.params.limit) || 10;
    // let searchValue = req.params.category || 0;
    let subcategoryValue = req.params.subcategory || 0;
    let categoryValue = req.params.category || 0;
    let skipRow = (pageno - 1) * perpage;
    let resData;

    // console.log(skipRow);
    // console.log(perpage);
    // console.log(categoryValue);
    // console.log(subcategoryValue);

    if (subcategoryValue !== "0") {
      // console.log(subcategoryValue);
      // console.log(categoryValue);
      resData = await Product.aggregate([
        {
          $facet: {
            total: [
              {
                $match: {
                  $and: [
                    { category: { $eq: categoryValue } },
                    { subcategory: { $eq: subcategoryValue } },
                  ],
                },
                // $match: { category: { $eq: categoryValue } },
              },
              { $count: "count" },
            ],
            blogData: [
              {
                $match: {
                  $and: [
                    { category: { $eq: categoryValue } },
                    { subcategory: { $eq: subcategoryValue } },
                  ],
                },
              },
              { $skip: skipRow },
              { $limit: perpage },
            ],
          },
        },
      ]);
    } else {
      // console.log(categoryValue);
      // console.log(subcategoryValue);
      resData = await Product.aggregate([
        {
          $facet: {
            total: [
              { $match: { category: { $eq: categoryValue } } },
              { $count: "count" },
            ],
            blogData: [
              { $match: { category: { $eq: categoryValue } } },
              { $skip: skipRow },
              { $limit: perpage },
            ],
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      message: "Product gets successfully",
      resData,
    });
  }
);

// get subCategory
exports.getAllSubCategory = catchAsyncError(async (req, res, next) => {
  try {
    let categoryValue = req.params.category;
    const resData = await Product.aggregate([
      { $match: { category: { $eq: categoryValue } } },
      { $group: { _id: "$subcategory" } },
    ]);
    // console.log(res)
    res.status(200).json({
      status: "success",
      resData,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Update Product --ADMIN
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const {
    productId,
    productname,
    description,
    price,
    demoprice,
    brand,
    image,
    category,
    subcategory,
    stock,
  } = req.body;
  if (
    !productId &&
    !productname &&
    !description &&
    !price &&
    !brand &&
    !image &&
    !category &&
    !subcategory
  ) {
    return next(new ErrorHandler("Please fill the value", 400));
  }
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      productId,
      productname,
      description,
      price,
      demoprice,
      brand,
      image,
      category,
      subcategory,
      stock,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    product: product,
  });
});

// Delete Product (--ADMIN)
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully!!",
    product: product,
  });
});

// Get single product
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product get successfully",
    product: product,
  });
});

// testing
exports.getAllProductsByCategorySubTesting = catchAsyncError(
  async (req, res, next) => {
    let pageno = Number(req.params.page) || 1;
    let perpage = Number(req.params.limit) || 10;
    let sortValue = Number(req.params.sort) || 0;
    let subcategoryValue = req.params.subcategory || 0;
    let categoryValue = req.params.category || 0;
    let skipRow = (pageno - 1) * perpage;
    let resData;

    console.log(skipRow);
    // console.log(perpage);
    // console.log(categoryValue);
    // console.log(subcategoryValue);

    if (subcategoryValue !== "0") {
      if (sortValue !== 0) {
        console.log(subcategoryValue);
        console.log(categoryValue);
        console.log(sortValue);
        resData = await Product.aggregate([
          {
            $facet: {
              total: [
                {
                  $match: {
                    $and: [
                      { category: { $eq: categoryValue } },
                      { subcategory: { $eq: subcategoryValue } },
                    ],
                  },
                  // $match: { category: { $eq: categoryValue } },
                },
                { $count: "count" },
              ],
              blogData: [
                {
                  $match: {
                    $and: [
                      { category: { $eq: categoryValue } },
                      { subcategory: { $eq: subcategoryValue } },
                    ],
                  },
                },
                { $skip: skipRow },
                { $limit: perpage },
                { $sort: { price: sortValue } },
              ],
            },
          },
        ]);
      } else {
        resData = await Product.aggregate([
          {
            $facet: {
              total: [
                {
                  $match: {
                    $and: [
                      { category: { $eq: categoryValue } },
                      { subcategory: { $eq: subcategoryValue } },
                    ],
                  },
                  // $match: { category: { $eq: categoryValue } },
                },
                { $count: "count" },
              ],
              blogData: [
                {
                  $match: {
                    $and: [
                      { category: { $eq: categoryValue } },
                      { subcategory: { $eq: subcategoryValue } },
                    ],
                  },
                },
                { $skip: skipRow },
                { $limit: perpage },
              ],
            },
          },
        ]);
      }
    } else {
      // console.log(categoryValue);
      // console.log(subcategoryValue);
      if (sortValue !== 0) {
        resData = await Product.aggregate([
          {
            $facet: {
              total: [
                { $match: { category: { $eq: categoryValue } } },
                { $count: "count" },
              ],
              blogData: [
                { $match: { category: { $eq: categoryValue } } },
                { $skip: skipRow },
                { $limit: perpage },
                { $sort: { price: sortValue } },
              ],
            },
          },
        ]);
      } else {
        resData = await Product.aggregate([
          {
            $facet: {
              total: [
                { $match: { category: { $eq: categoryValue } } },
                { $count: "count" },
              ],
              blogData: [
                { $match: { category: { $eq: categoryValue } } },
                { $skip: skipRow },
                { $limit: perpage },
              ],
            },
          },
        ]);
      }
    }

    res.status(200).json({
      success: true,
      message: "Product gets successfully",
      resData,
    });
  }
);

// search
exports.getAllProductsBySearching = catchAsyncError(async (req, res, next) => {
  let pageno = Number(req.params.page) || 1;
  let perpage = Number(req.params.limit) || 10;
  let searchValue = req.params.search || 0;
  let skipRow = (pageno - 1) * perpage;
  let resData;

  console.log(skipRow);
  // console.log(perpage);
  // console.log(categoryValue);
  // console.log(subcategoryValue);

  if (searchValue !== "0") {
    let searchRegex = {
      $regex: searchValue,
      $options: "i",
    };
    let searchQuery = {
      $or: [
        { productname: searchRegex },
        { price: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
      ],
    };
    resData = await Product.aggregate([
      {
        $facet: {
          total: [{ $match: searchQuery }, { $count: "count" }],
          products: [
            { $match: searchQuery },
            { $skip: skipRow },
            { $limit: perpage },
          ],
        },
      },
    ]);
  } else {
    resData = await Product.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          product: [{ $skip: skipRow }, { $limit: perpage }],
        },
      },
    ]);
  }
  res.status(200).json({
    success: true,
    message: "Product gets successfully",
    resData,
  });
});
