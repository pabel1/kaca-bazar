const catchAsyncError = require("../middlewares/catchAsyncError");
const Errorhandeler = require("../utility/ErrorHandler");

const Team = require("../models/TeamModel");
// creating a team member
exports.createTeam = catchAsyncError(async (req, res, next) => {
  const { name, designation, description, image } = req.body;
  if (!name || !designation || !description || !image) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  const team = await Team.create({
    name,
    designation,
    description,
    image,
  });
  res.status(201).json({
    success: true,
    message: "Team Created Successfully",
    team,
  });
});

// get all team member
exports.getAllTeamMembers = catchAsyncError(async (req, res, next) => {
  const teams = await Team.find();
  if (!teams) {
    return next(new Errorhandeler("No team member found", 404));
  }
  res.status(200).json({
    success: true,
    teams,
  });
});

// update a team member
exports.updateTeamMember = catchAsyncError(async (req, res, next) => {
  const { name, designation, description, image } = req.body;
  if (!name && !designation && !description && !image) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  let team = await Team.findById(req.params.id);
  if (!team) {
    return next(new Errorhandeler("Team member is not found", 404));
  }
  team = await Team.findByIdAndUpdate(req.params.id, {
    name,
    designation,
    description,
    image,
  });
  res.status(200).json({
    success: true,
    message: "Team Member Updated successfully",
    team,
  });
});

// delete a team member
exports.deleteTeamMember = catchAsyncError(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    return next(new Errorhandeler("Team member is not found", 404));
  }
  await team.remove();
  res.status(200).json({
    success: true,
    message: "Team Member deleted successfully",
    team,
  });
});
