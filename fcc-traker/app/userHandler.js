// In this file, we'll write all of our code for handling the various GET and POST requests for our app/site:
// NB: To make our functions accessible to our endpoint routing in server.js, we'll save our functions as exports:


// We'll be needing our user Models/schemas, which we saved in separate files for cleanliness:
const UserEntry = require("./userEntry");  // Note capitalisation because this is a Model/constructor
const UserExercise = require("./userExercise");
// We'll also be needing Mongoose.js to check that the userId's that are being submitted are valid ObjectId types.
const mongoose = require("mongoose");

///////////////////////////////////
////////// POST REQUESTS //////////
///////////////////////////////////

// USER STORY: I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
exports.addUser = function(req, res) {  
  // The user stories don't require us to check that the new username doesn't already exist in the DB, but it seems like a good thing to do, so let's check its "uniqueness":
  UserEntry.findOne( {username: req.body.username}, function(err, data) {
    // Let's first handle any errors that might arrise while connecting to the remote database:
    if (err) return console.log("Error checking for matching new username:", err);
    
    // If we received any data, then it means that the new username already exists in the DB. Let's respond with an appropriate error message:
    if (data) {
      return res.json( {"Error": "Sorry, but that username already exists in the database. Please choose a different username and try again."} );
    }
    // If we don't receive any data back, then the new username doesn't yet exist in the database, so let's create and save a new Document/instance for it:
    else {
      let newUser = new UserEntry({
        username: req.body.username
      });

      // ... and save the new Document/Instance to the database, using a callback function to make sure that everything went well:
      newUser.save(function(err, data) {
        // We'll first handle any errors that might arrise while working with the remote database...
        if (err) return console.log("Error saving newUser to DB:", err);
        // .. and then return the username and its _id as a JSON object as per the user story:
        return res.json({
          "username": data.username,
          "id": data.id
        }); 
      });  // END of newUser.save()
    };  // END of else statement
    
  });  // END  of UserEntry.findOne()
};  // END of exports.addUser()



// USER STORY: I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add.
            // If no date supplied it will use current date. Returned will the the user object with also with the exercise fields added.
exports.addExercise = function(req, res) {
  
  // N.B. The validation to make sure that the required fields have been filled out in the form is being done by the browser. That is to say, all the 
  // required fields in the form have the attribute "required" and the form will not be submitted by the broswer unless they have been filled out.
  // A more robust solution would include server-side data validation.
  
  // To avoid "CastError: Cast to ObjectId failed for value [...]" errors when we run a query using Model.findById(), we'll need to make sure that
  // the submitted userId string is of Type ObjectId:
  if ( !mongoose.Types.ObjectId.isValid(req.body.userId) ) {
    // Because the passed userId is not (!) of a valid type, we can be certain that there will not be any matches in the DB, so let's respond with an appropriate error message:
    return res.json( {"Error": "'" + req.body.userId + "' is not a valid ID format. Please check to make sure that you have the right ID and try again."} );
  };  
  
  
  // If the userId that was submitted is valid, then the next step we need to take it to get the username for the given userId from our UserEntry collection.
  // We'll need the username for our response, but we also need to check to make sure that the submitted userId "exists" (i.e. actually has a matching user in the DB):
  UserEntry.findById( req.body.userId, function(err, data) {
    // We'll handle any errors arrising from working with the remote database:
    if (err) return console.log("Error checking for matching userId in user collection:", err);
    
    // Even with a valid ObjectId type, it could be that there is no matching user in our DB collection.
    // If there is no match for the given ID, mongoose returns null to .findById(), which is falsey:
    if (!data) {
      return res.json( {"Error": "That user ID doesn't exist in the database. Please check to make sure that you have the right ID and try again."} );
    }
    // If we received some data back, that means that there's a matching user, so we can create a new exercise Document/instance and save it to our UserExercises collection:
    else {
      // Let's create a new exercise Document/instance. Because the date field is optional, if we pass an empty date property to our database,
      // even if our schema has a default for the date, mongoose will save it as null. The only way to trigger the default setting of the schema
      // is to not pass the date key-value pair at all if the user didn't submit a date:
      let newExercise;
      
      // If the user submitted a date:
      if (req.body.date) {
        newExercise = new UserExercise({
          username: data.username,
          //userId: req.body.userId,
          description: req.body.description,
          duration: req.body.duration,
          date: req.body.date    // Include the date key-value pair ONLY if we have a submitted date
        });
      }
      // If the user did not submit a date, we don't include a date kay-value pair:
      else {
        newExercise = new UserExercise({
          username: data.username,
          //userId: req.body.userId,
          description: req.body.description,
          duration: req.body.duration,
        });
      }

      // With the new exercise ready, let's save it to the database, making sure to use a callback function:
      newExercise.save(function(err, data) {
        // We'll handle any errors that might arrise from working with the remote database...
        if (err) return console.log("Error while saving new exercise:", err);
        
        // ... and then we'll respond with a JSON object as per the user story requirements:
        return res.json({
          username: data.username,
          _id: req.body.userId,
          description: data.description,
          duration: data.duration,
          date: data.date          
        });
      });  //END of newExercise.save()
      
    };  // END of else statement
  });  // END of UserEntry.findById()
};  // END of exports.addExercise()




//////////////////////////////////
////////// GET REQUESTS //////////
//////////////////////////////////

// USER STORY: I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
exports.getAllUsers = function(req, res) {
  UserEntry.find(function(err, data) {
    // We'll handle any errors that might arrise from working with the remote database:
    if (err) return console.log("Error finding all users:", err);
    
    // If we received an array with at least one user in it, then we know that there are some users in our DB, and we should therefore return all the users we have:
    if (data.length > 0) {
      return res.json( data );
    }
    // If the data we received is an empty array, then that means that there are no users in the DB yet, so we should respond to the user's request with an appropriate message:
    else{
      return res.json( {"Error": "There are currently no users in the database."} );      
    };
    
  });  // END of UserEntry.find()  
};  // END of exports.getAllUsers()




// USER STORY: I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id).
            // Return will be the user object with added array log and count (total exercise count).
            // I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)
exports.getAllExercises = function(req, res) {
  // Express makes it easy to retrieve JSON query parameters from a URL. They get stored in req.query:  
  let userId = req.query.userId;
  let fromDate;
  let toDate;
  let limit;  
  
  // Before populating all of our variables, we'll first do a spot of data validation on the incoming JSON query parameters:
    
  // Because our userExercise Schematypes for dates are of type Date, we need to convert the JSON string for Mongoose to be able to correctly compare when runing a query.
  // If there are no From or To parameters, then we'll set those to the start of CE time and today, respectively, as Date objects:
  if (req.query.from) {
    // We received a From date in the JSON query, so let's save that as a Date object:
    fromDate = new Date(req.query.from)
  }
  else {
    // If we didn't receive a From date, then we'll set it to the start of CE, which should be long-enough ago for this exercise tracker:
    fromDate = new Date("0001-01-01")
  };
  
  if (req.query.to) {
    // We received a To date in the JSON query, so let's save that as a Date object:
    toDate = new Date(req.query.to)
  }
  else {
    // If we didn't receive a To date, then we'll set it to today:
    toDate = new Date()
  };
  
  
  // We'll also check to make sure that the from/to dates we've saved are valid dates, and respond with an appropriate error message when they are not in the right format:
  if ( isNaN(fromDate) && req.query.from ) return res.json( {"Error": "The 'from' date is not in a valid date format. Please try again with a date in YYYY-MM-DD format."} );
  if ( isNaN(toDate) && req.query.to ) return res.json( {"Error": "The 'to' date is not in a valid date format. Please try again with a date in YYYY-MM-DD format."} );
  
  
  // Next we'll make sure that the To date is more recent than the From date, and respond with an appropriate message if this is not the case:
  if (fromDate > toDate) return res.json( {"Error": "The submitted 'from' date is more recent than the 'to' date. Please check the dates and try again."} );
  
  
  // Now we need to check that if a limit value was submitted in the JSON query, it is a Number. We need to do this because Mongoose's .limit() takes a numeric
  // To test req.query.limit, we'll add it to nothing, and then checking it with isNaN (N.B. parseInt("12px") returns 12, which is why we don't use this method ):
  if ( isNaN(0 + req.query.limit) && req.query.limit ) {
    return res.json( {"Error": "The limit parameter of this query (limit = " + req.query.limit + ") is not correcly set. Please make sure that it is an integer and try again."} );
  }
  else {
    // If req.query.limit is a number, we'll convert it from its current state as a JSON/URL string into an Integer and save it. 
    limit = parseInt(req.query.limit);
  };  
  
  
  // Finally, the last thing we need to validate is whether the userID is of valid Type ObjectId:
  if ( !mongoose.Types.ObjectId.isValid(userId) ) {
    // The attempted userId is not (!) in valid ObjectId format, which means we won't find any matches in the DB collection, so let's respond with an appropriate error message.
    return res.json( {"Error": "User ID '" + userId + "' is not in a valid ID format. Please check to make sure that you have the right ID and try again."} );
  };
  
  
  
  // With validation done and out of the way, we can check that the userId actually exists in our UserEntry DB collection, and at the same time, find its matching username:
  UserEntry.findById( userId, function(err, data) {
    // We'll handle any errors that might arrise while working with the remote DB:
    if (err) return console.log("Error while trying to find matching username:", err);
    
    // If we DON'T (!) have data, it means that though userId is a valid ObjectId, there's no match in our UserEntry DB collection. Let's respond with an appropriate error message:
    if (!data) {
      return res.json( {"Error": "That user ID doesn't exist in the database. Please check to make sure that you have the right ID and try again."} );
    }
    // If we DO have data, then that means that the submitted user ID is valid and has an associated username. Let's query for all of the user's exercises:
    else {
      let username = data.username;
      
      // We'll chain query helpers to our .find() query, passing them the JSON parameters that we saved from the user's query in order to get the requested exercise log:
      UserExercise
        .find({
          username: username,
          date: {$gte: fromDate, $lte: toDate}
        })
        .select("description duration date -_id")
        .limit( limit )
        .exec(function(err, data) {
          // We'll handle any errors that might arrise when working with the remote database:
          if (err) return console.log("Error searching for exercises for username '" + username + "' with error:", err);

          if (data.length > 0) {
            // We have a matching user, so let's respond with a JSON object containing their exercise log, including user details and log count, as per the user story requirements:
            return res.json({
              username: username,
              _id: userId,
              count: data.length,
              log: data
            });
          }
          else {
            // If we didn't get any data back, then that can mean one of two things: 1) they don't have any saved exercises at all, or 2) the query parameters are too strict.
            // Let's respond appropriately to each of these potential scenarios, we'll need to run a query to see how many exercises (if any) are saved for the given user:
            UserExercise.find( {username: username}, function(err, data) {
              // We'll handle any errors that might arrise while querying the remote database:
              if (err) return console.log("Error:", err);
              
              if (data.length > 0) {
                // This user actually has saved exercises, but the query parameters are too strict, so we're not getting any results. Let's respond accordingly:
                return res.json( {"Error": "User " + username + " (user ID: " + userId + ") has saved exercises, but none that match the search parameters."} );
              }
              else {
                // There are actually no saved exercises for the given user at all, so let's respond with an appropriate message:
                return res.json( {"Error": "User " + username + " (user ID: " + userId + ") doesn't have any exercises saved yet."} );
              }
            });
            
          }  // END of else statement for data received back from query helper .find() attempt
        });  // END of UserExercise.find()
      
    }; // END of else statement for checking if the userId has a matching username (and is therefore a valid userId)
  });  // END of UserEntry.findById()

};  // END of exports.getAllExercises()