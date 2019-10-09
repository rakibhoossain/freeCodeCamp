
var express = require('express');
var bodyParser = require('body-parser');

var app = express();


app.use(bodyParser.urlencoded({extended: false}));

app.use( (req, res, next)=>{
console.log(req.method+" "+req.path+" - "+req.ip);
next();
})

console.log( "Hello World" );
app.get('/', (req, res)=> res.sendFile(__dirname+'/views/index.html'));


app.get('/json',(req,res)=>res.json( 
  
  (process.env.MESSAGE_STYLE == 'uppercase')?
  {"message": "HELLO JSON"}: {"message": "Hello json"}
  


));
/*
app.use((req,res,next)=>{
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});
*/



console.log(process.env.MESSAGE_STYLE);


app.use(express.static(__dirname + '/public/'));
// --> 7)  Mount the Logger middleware here


// --> 11)  Mount the body-parser middleware  here


/** 1) Meet the node console. */


/** 2) A first working Express Server */


/** 3) Serve an HTML file */


/** 4) Serve static assets  */


/** 5) serve JSON on a specific route */


/** 6) Use the .env file to configure the app */
 
 
/** 7) Root-level Middleware - A logger */
//  place it before all the routes !


/** 8) Chaining middleware. A Time server */

app.get('/now', (req,res,next)=>{
  req.time = new Date().toString();
  next();
},(req,res)=>{
  res.json({time: req.time});
}
       );
/** 9)  Get input from client - Route parameters */
app.get('/:word/echo',(req,res)=>{
  res.json({echo: req.params.word});
});

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>


const queryhandler = (req,res)=>{
  res.json({ name: req.query.first+' '+req.query.last});
}
app.route('/name').get(queryhandler);
  
/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** 12) Get data form POST  */

app.post('/name', (req,res)=>{
  res.json({ name: req.body.first+' '+req.body.last});
});

// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;
