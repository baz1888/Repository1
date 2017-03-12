var mongo = require('mongodb');
var BSON = mongo.BSONPure;
var ObjectId = require("mongodb").ObjectID;

// get mongo client
var mongoClient = mongo.MongoClient;
var mongoDb;
mongoClient.connect("mongodb://admin:celtic@ds163699.mlab.com:63699/footballleagueapi", function(err, db) {
if(!err) {
  console.log("We are connected");
  mongoDb = db;
}
else
{
    console.log("Unable to connect to the db");
}
});



// Get list of fixture
exports.index = function(req, res) {
   // Connect to the db
    if (mongoDb){
      var collection = mongoDb.collection('Matchs');
      collection.find().toArray(function(err, items) {
          res.send(items);
      });
    }
    else
    {
        console.log('No database object!');
        res.send("There are no fixtures created yet!")
    }

} ;




// Creates a new fixture in mongo
exports.create = function(req, res) {

  var fixture = req.body;
    console.log('Adding fixture: ' + JSON.stringify(fixture));
    if (mongoDb){
      var collection = mongoDb.collection('Matchs');
      collection.insert(fixture, {w:1}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send("A new fixture has been successfully created!").status(201);
            }
        });
    }
  else
  {
    console.log('No database object!');
  }

};

// Update an existing fixture in datastore.
exports.update = function(req, res) {

  var id = req.params.id;
  var fixture = req.body;
  console.log('Updating fixture: ' + id);
  console.log(JSON.stringify(fixture));
  var collection = mongoDb.collection('Matchs');
  collection.updateOne({'_id':ObjectId(id)}, fixture, {safe:true}, function(err, result) {
          if (err) {
              console.log('Error updating fixture: ' + err);
              res.send({'error':'An error has occurred'});
          } else {
              console.log('' + result + ' document(s) updated');
              res.send("The fixture with ID: " + id + " has been updated!");
          }
  });

};

// delete an existing fixture in datastore.
exports.delete = function(req, res) {

    var id = req.params.id;
  console.log('Deleting fixture: ' + id);
  var collection = mongoDb.collection('Matchs');
  collection.removeOne({'_id':ObjectId(id)},     function(err, result) {
      if (err) {
          res.send('Fixture does not exist!');
      } else {
          console.log('' + result + ' document(s) deleted');
          res.send("The fixture with ID: " + id + " has been deleted!");
      }
  });

}

// finding an existing fixture in datastore.
exports.findFixture = function(req, res) {

    var id = req.params.id;
  console.log('Finding fixture ' + id);
  var collection = mongoDb.collection('Matchs');
  collection.findOne({'_id':ObjectId(id)},     function(err, result) {
      if (err) {
          res.send('Fixture does not exist please enter a correct ID!');
      } else {
          console.log('' + result + ' fixture found');
          res.send(result);
      }
  });

}


