var _ = require('lodash');
var Results = require('../../models/resultsModel');
var contactEvent = require("../../events.js")
// Get list of results
exports.index = function(req, res) {
// Connect to the db
Results.find(function (err, results) {
if(err) { return handleError(res, err); }
return res.status(200).json(results);
});
} ;

exports.findFixture = function(req, res) {
// Connect to the db
Results.find(function (err, result) {
if(err) { return handleError(res, err); }
return res.status(200).json(result);
});
} ;

// Creates a new result in datastore.
exports.create = function(req, res) {
Results.create(req.body, function(err, results) {
contactEvent.publish('create_contact_event', results);
if(err) { return handleError(res, err); }
return res.status(201).json(results);
});
};
// Updates an existing result in the DB.
exports.update = function(req, res) {
if(req.body._id) { delete req.body._id; }
Results.findById(req.params.id, function (err, result) {
if (err) { return handleError(res, err); }
if(!result) { return res.status(404); }
var updated = _.merge(result, req.body);
updated.save(function (err) {
if (err) { return handleError(res, err); }
return res.json(result);
});
});
};

// delete an existing result in datastore.
exports.delete = function(req, res) {
Results.findById(req.params.id, function (err, result) {
if(err) { return handleError(res, err); }
if(!result) { return res.status(404); }
result.remove(function(err) {
if(err) { return handleError(res, err); }
return res.json(204);
});
});
};

function handleError(res, err) {
return res.status(500).json(err);
};
