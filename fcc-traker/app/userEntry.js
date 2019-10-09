// To keep things tidy, we'll define our Model in this separate file.

// We'll need Mongoose in order to work with our MongoDB:
const mongoose = require("mongoose");

// In order to create new Documents/Instances in our database, we'll need a Schema that our entries should conform to:
const userSchema = new mongoose.Schema({
  username: {type: String, required: true}
});

// With our schema in hand, we can create a Model/constructor, giving it a name and telling the Mongoose which schema to use for our model.
// We'll export it all so that the Model can be accessed outside of this file:
module.exports = mongoose.model("UserEntry", userSchema);