var mongoose = require('mongoose');

module.exports = mongoose.model('User', 
    new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        date_modified: {type:Date, default:Date.now},
        date_created: {type:Date, default:Date.now},
        type: {type: String}
    })
    .pre('save', function(next) {
        this.date_modified = new Date();
        next();
     })

);