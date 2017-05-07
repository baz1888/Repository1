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
var helmet = require('helmet');

app.use(helmet());
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
var register = express.Router();
app.use('/api', register);
var memberarea = express.Router();
app.use('/memberarea', memberarea);



//configure the express app to parse JSON-formatted body
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);
memberarea.use(bodyParser.json());
memberarea.use(passport.initialize());
app.use(require('body-parser').json())

//app.use(bodyParser.urlencoded({ extended: false }));



const httpsOptions ={
	cert: fs.readFileSync(path.join(__dirname, "ssl", "server.crt")),
	key: fs.readFileSync(path.join(__dirname, "ssl", "server.key"))
}

https.createServer(httpsOptions, app)
	.listen(config.port, function(){
		console.log(`Serving https connection`)})

// Put a friendly message on the terminal
console.log("Server running at "+ config.port+" by host: "+  config.host);

//create routing object
var contact = require('./api/fixtures/index');


//Add routes for football api
memberarea.get('/fixtures',contact.index);
memberarea.get('/fixtures/:id',contact.findFixture);
memberarea.post('/fixtures',contact.create);
memberarea.put('/fixtures/:id',contact.update);
memberarea.delete('/fixtures/:id',contact.delete);
mongoose.connect(config.database);


 

 
// create a new user
register.post('/signup',urlencodedParser, function(req, res) {
  if (!req.body.name || !req.body.password || !req.body.email) {
    res.json({success: false, msg: 'Please fill all fields to register.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.status(400).send({success: false, msg: 'User already exists'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});



register.post('/authenticate',urlencodedParser, function(req, res) {
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

//Tried creating a secure route, requiring the user to enter a token to perform get all fixtures,post,update & delete
memberarea.use(passport.authenticate('jwt', { session: false}), function(req, res) {
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







