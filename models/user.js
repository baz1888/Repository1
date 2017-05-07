var mongoose = require('mongoose');
var validator = require('node-mongoose-validator');
var Schema = mongoose.Schema;

// set up a mongoose model
var UserSchema = new Schema({
  name: {
        type: String,
        unique: true,
        required: true
    },
  password: {
        type: String,
        required: true
    },
    email: { type: String, set: toLower },

  updated: { type: Date, default: Date.now }
});

UserSchema.path('email').validate(validator.isEmail(), 'Please provide a valid email address');


UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

function toLower (str) {
    return str.toLowerCase();
}
 
module.exports = mongoose.model('User', UserSchema);