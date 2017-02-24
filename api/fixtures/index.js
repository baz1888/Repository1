var datastore = require('./datastore - fixtures');
var shortId = require('shortid');
// Get list of contacts
exports.index = function(req, res) {
  return res.json(200, datastore.fixtures);
} ;
// Creates a new contact in datastore.
exports.create = function(req, res) {
  var fixture = {
     id: shortId.generate(),
     Matchday: req.body.Matchday,
     Hometeam: req.body.Hometeam,
     Awayteam: req.body.Awayteam
  };
  datastore.teams.push(fixtures)
  return res.json(201, fixture);
};

// Update an existing contact in datastore.
exports.update = function(req, res) {
    var index = datastore.contacts.map(function(x) {return x.id; }).indexOf(req.params.id);
    if (index != -1) {
       var contact = datastore.contacts[index]
       contact.name =  req.body.name
       contact.address = req.body.address
       contact.phone_number = req.body.phone_number
       return res.send(200, contact) 
    } else {
        return res.send(404)
    }
};
