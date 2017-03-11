'use strict'

const express = require ("express")
const fs = require("fs")
const https = require ("https")
var http = require('http');
const path = require ("path")
const app = express()
const directoryToServer = "client"
var bodyParser = require('body-parser');
var config=require('./config/database');
var User        = require('./models/user');
var mongoose    = require('mongoose');
var passport	= require('passport');
var jwt         = require('jwt-simple');
var cookieSession = require('cookie-session');
var cookes = require("cookies");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");


app.use(cookieParser());
app.use(session({secret: "anystringoftext",
        saveUninitialized:true,
        resave:true }));

app.use("/checkCookie", function(req, res){
  res.send("Cookie has been assigned");

  console.log(req.cookies);
  console.log("============");
  console.log(req.session)

});

// bundle our routes
var apiRoutes = express.Router();
app.use('/api', apiRoutes);

//configure the express app to parse JSON-formatted body
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(passport.initialize());

//app.use(bodyParser.urlencoded({ extended: false }));



const httpsOptions ={
	cert: fs.readFileSync(path.join(__dirname, "ssl", "server.crt")),
	key: fs.readFileSync(path.join(__dirname, "ssl", "server.key"))
}

https.createServer(httpsOptions, app)
	.listen(config.port, function(){
		console.log(`Serving https connection`)})

//add route for the root
app.get('/',function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("We're up and running!!!");
});

// Put a friendly message on the terminal
console.log("Server running at "+ config.port+" by host: "+  config.host);

//create routing object
var contact = require('./api/fixtures/index');


//Add routes for contacts api
app.get('/api/fixtures',contact.index);
app.post('/api/fixtures',contact.create);

app.put('/api/fixtures/:id',contact.update);
app.delete('/api/fixtures/:id',contact.delete);

mongoose.connect(config.database);
 
// pass passport for configuration
require('./config/passport')(passport);

 
// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup',urlencodedParser, function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please enter name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

apiRoutes.post('/authenticate',urlencodedParser, function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          return res.status(403).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});


// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  console.log('the token: ' + token);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});

 var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};



app.use('/api', apiRoutes);


