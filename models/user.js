var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        salt: {type: String},
        hash: {type:String},
        email: {type: String, required: true, unique: true},
        date_modified: {type:Date, default:Date.now},
        date_created: {type:Date, default:Date.now},
        type: {type: String}
    })
    .pre('save', function(next) {
        this.date_modified = new Date();
        next();
     });
     
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}   

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
}

userSchema.methods.generateJwt = function() {
  /*var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);*/

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: Math.floor(Date.now() / 1000) + (60*60),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

module.exports = mongoose.model('User', userSchema);