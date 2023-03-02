// external import
const jwt = require("jsonwebtoken");

// internal import
const User = require("../models/userModel");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utility/ErrorHandler");

// Check the login user
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { logintoken } = req.cookies;
  if (!logintoken) {
    // return next(new ErrorHandler("Please login to access the resource", 401));
    return;
  }
  const decodeData = jwt.verify(logintoken, process.env.JWT_SECRET_KEY);

  const rootUser = await User.findById(decodeData.id);
  req.user = rootUser;
  req.token = logintoken;
  next();
});

// Check the authorized admin
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userRole)) {
      return;
    }
    next();
  };
};
