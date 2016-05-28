var mongoose = require('mongoose');

var BlogSchema = new mongoose.Schema({
  title: String,
  body: String,
  modified_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', BlogSchema);