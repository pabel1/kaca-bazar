// external import
const ClientSay = require("../models/clientsaysModel");

// internal import
const catchAsyncError = require("../middlewares/catchAsyncError");
const Errorhandeler = require("../utility/ErrorHandler");

// creating client
exports.createClient = catchAsyncError(async (req, res, next) => {
  const { name, designation, description, image } = req.body;
  if (!name || !designation || !description || !image) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  const client = await ClientSay.create({
    name,
    designation,
    description,
    image,
  });
  res.status(201).json({
    success: true,
    message: "Client Created Successfully",
    client,
  });
});

// get all clients
exports.getAllClient = catchAsyncError(async (req, res, next) => {
  const clients = await ClientSay.find();
  if (!clients) {
    return next(new Errorhandeler("No clients found", 404));
  }
  res.status(200).json({
    success: true,
    clients,
  });
});

// get all clients
exports.deleteClient = catchAsyncError(async (req, res, next) => {
  const client = await ClientSay.findById(req.params.id);
  if (!client) {
    return next(new Errorhandeler("Client not found", 404));
  }
  await client.remove();
  res.status(200).json({
    success: true,
    message: "Client deleted successfully",
    client,
  });
});

// get all clients
exports.updateClient = catchAsyncError(async (req, res, next) => {
  const { name, designation, description, image } = req.body;
  if (!name && !designation && !description && !image) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  let client = await ClientSay.findById(req.params.id);
  if (!client) {
    return next(new Errorhandeler("Client not found", 404));
  }
  client = await ClientSay.findByIdAndUpdate(req.params.id, {
    name,
    designation,
    description,
    image,
  });
  res.status(200).json({
    success: true,
    message: "Client Updated successfully",
    client,
  });
});
