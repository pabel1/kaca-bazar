const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    campaignname: {
      type: String,
      required: [true, "Please enter campaign name"],
      trim: true,
    },
    validationDate: {
      type: String,
      required: [true, "Please enter campaign date"],
    },
    discountPriceInTk: {
      type: Number,
     
    },
    discount: {
      type: String,
      required: [true, "Please enter discount "],
    },
    image: {
      type: String,
      required: [true, "Please select discount image"],
    },
    category: {
      type: String,
      required: [true, "Please enter campaign category"],
    },
    // subcategory: {
    //   type: String,
    //   required: [true, "Please enter campaign subcategory"],
    // },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
