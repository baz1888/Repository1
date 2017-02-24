var express = require('express');
var bodyParser = require('body-parser');
//create an express app
var app = express();

//configure the express app to parse JSON-formatted body
app.use(bodyParser.json());

//add route for the root
app.get('/',function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("We're up and running!!!");
});
// Listen on port 8000, IP defaults to 127.0.0.1
app.listen(8000)
// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");

//create routing object
var contact = require('./api/teams/index');
//Add routes for contacts api
app.get('/api/teams',contact.index);
app.post('/api/teams',contact.create);

app.put('/api/teams/:id',contact.update);
app.delete('/api/teams/:id',contact.delete);


var contact = require('./api/fixtures/index');
app.get('/api/fixtures',contact.index);