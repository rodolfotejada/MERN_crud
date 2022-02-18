const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

//GET GOALS:
const getGoals = asyncHandler(async (req, res) => {
  //step 1 (Identify goal = user relation)
  const goals = await Goal.find({ user: req.user.id }); //this is coming from the middleware 'protect'. // remember that "user" is now a field on the goal model.

  //step 2
  res.status(200).json(goals);
});

//CREATE GOALS:
const setGoals = asyncHandler(async (req, res) => {
  //step 1
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  //step 2
  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });

  //step 3
  res.status(200).json(goal);
});

//UPDATE GOAL:
const updateGoals = asyncHandler(async (req, res) => {
  //step 1 (VALIDATE GOAL)
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error('Goal not found');
  }

  //step 2 (VALIDATE USER )
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  if (goal.user.toString() !== user.id) {
    //Remember 'goal.user' is coming from the Goal model field.
    res.status(401);
    throw new Error('User not authorized');
  }

  //step 3 (UPDATE)
  const updatedGoal = await Goal.findByIdAndUpdate(goal, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

//DELETE GOAL:
const deleteGoals = asyncHandler(async (req, res) => {
  //step 1 (VALIDATE GOAL)
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error('Goal not found');
  }

  //step 2 (VALIDATE USER )
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  ///step 3 (DELETE)
  const goalDeleted = await Goal.findByIdAndDelete(goal);
  res
    .status(200)
    .json({ message: `Goal with ID: ${req.params.id}, was just deleted!` });
});

module.exports = {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals,
};
