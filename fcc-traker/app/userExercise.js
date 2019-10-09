// We'll be needing mongoose to create the Schema and Model for this type of Document/Instance:
const mongoose = require("mongoose");

// With mongoose at the ready, let's create the Schema that our Documents/instances will have to follow:
const exerciseSchema = new mongoose.Schema({
  username: {type: String, required: true},
  userId: {type: String},    // This field will help us when trying to track all the exercises for a given user without having to jump between user and exercise collections
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {type: Date, default: Date.now()}
});

// With our schema in hand, let's create our Model/constructor and save it as an export so that it can be accessed from outside this file:
module.exports = mongoose.model("UserExercise", exerciseSchema);