'use strict';
//MONGOOSE
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('node-mongoose-validator');
var now = new Date();

var resultsSchema = new Schema({
  	
  	HomeTeam: {type: String, required: true},

  	AwayTeam: {type: String, required: true},

  	referee: {type: String, required: true},

  	attendance: { type: Number, min: 1, max: 100000 },

  	fixtureState:{
        type: String,
        default: 'To be played', 
        enum:['To be played', 'Playing', 'Played']},

    stats: [{
    
      HomeStats:[{
        goal: { type: Number, required: true},
        shotsOnTarget:{ type: Number, required: true},
        shotsOffTarget:{ type: Number, required: true},
        possession:{ type: Number, required: true},
        corners:{ type: Number, required: true},
        offsides:{ type: Number, required: true},
        fouls:{ type: Number, required: true},
        cards:{ type: Number, required: true},
        goalKicks:{ type: Number, required: true},
        treatments:{ type: Number, required: true},

      }],

      AwayStats:[{
      	goal: { type: Number, required: true},
        shotsOnTarget:{ type: Number, required: true},
        shotsOffTarget:{ type: Number, required: true},
        possession:{ type: Number, required: true},
        corners:{ type: Number, required: true},
        offsides:{ type: Number, required: true},
        fouls:{ type: Number, required: true},
        cards:{ type: Number, required: true},
        goalKicks:{ type: Number, required: true},
        treatments:{ type: Number, required: true},
      }]
}]
  
});




module.exports = mongoose.model('Results', resultsSchema);