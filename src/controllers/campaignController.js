// external import
const Campaign = require("../models/campaignModel");

// internal import
const catchAsyncError = require("../middlewares/catchAsyncError");
const Errorhandeler = require("../utility/ErrorHandler");

// create campaign
exports.createCampaign = catchAsyncError(async (req, res, next) => {
  const {
    campaignname,
    validationDate,
    discount,
    image,
    category,
    discountPriceInTk,
  } = req.body;
  if (
    !campaignname ||
    !validationDate ||
    !discount ||
    !image ||
    !category ||
    !discountPriceInTk
  ) {
    return next(new Errorhandeler("Please fill the value first", 400));
  }
  const campaign = await Campaign.create({
    campaignname,
    validationDate,
    discount,
    image,
    category,
    discountPriceInTk,
  });
  res.status(201).json({
    success: true,
    message: "Campaign Creation Successfully",
    campaign,
  });
});

// get all campaigns
exports.getAllCampaigns = catchAsyncError(async (req, res, next) => {
  const campaigns = await Campaign.find();
  res.status(200).json({
    success: true,
    campaigns,
  });
});
// exports.getAllCampaigns = catchAsyncError(async (req, res, next) => {
//   let pageno = Number(req.params.page) || 1;
//   let perpage = Number(req.params.limit) || 10;

//   let skipRow = (pageno - 1) * perpage;
//   const campaigns = await Campaign.find().skip(skipRow).limit(perpage);
//   res.status(200).json({
//     success: true,
//     campaigns,
//   });
// });

// update a campaign
exports.updateCampaign = catchAsyncError(async (req, res, next) => {
  const {
    campaignname,
    validationDate,
    discount,
    image,
    category,
    discountPriceInTk,
  } = req.body;
  if (
    !campaignname &&
    !validationDate &&
    !discount &&
    !image &&
    !category &&
    !discountPriceInTk
  ) {
    return next(new Errorhandeler("Please fill the value first", 400));
  }
  let campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    return next(new Errorhandeler("Campaign Not Found", 404));
  }

  campaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    {
      campaignname,
      validationDate,
      discount,
      image,
      category,
      discountPriceInTk,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    success: true,
    message: "Campaign Updated Successfully",
    campaign,
  });
});

// delete a campaign
exports.deleteCampaign = catchAsyncError(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    return next(new Errorhandeler("Campaign Not Found", 404));
  }
  await campaign.remove();
  res.status(200).json({
    success: true,
    message: "Campaign Deleted Successfully",
    campaign,
  });
});
