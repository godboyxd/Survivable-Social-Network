var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var postSchema = new Schema({

module.exports = mongoose.model('post', postSchema);