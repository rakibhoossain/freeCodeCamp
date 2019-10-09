const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userHandler = require("./userHandler");
const cors = require('cors');

const mongoose = require('mongoose');
//mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

mongoose
  .connect(process.env.MLAB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));


// If the user adds a new username to the database:
app.post("/api/exercise/new-user", userHandler.addUser);


// If the user tries to add exercises to a given username in the database:
app.post("/api/exercise/add", userHandler.addExercise);


// If the user asks to GET all the users in the database:
app.get("/api/exercise/users", userHandler.getAllUsers);


// If the user wants to GET the full exercise record for a given username:
app.get("/api/exercise/log", userHandler.getAllExercises);


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
