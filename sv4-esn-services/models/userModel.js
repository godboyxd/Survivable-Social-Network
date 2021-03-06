var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : {type: String, default: null},
	'email' : {type: String, default: null},
	'password' : {type: String, default: null},
	'created_at' : {type: String, default: Date.now},
	'updated_at' : {type: String, default: Date.now},
	'role' : {type: String, default: 'CITIZEN'},
	'status': {type: Number, default: 0}, //OK, Help, EMERGENCY, Undefined
    'status_information':{type: String, default: null},
	'online': {type: Boolean, default: false},
	'locationName': {type: String, default: null},
    'locationDescription': {type: String, default: null},
    'latitude': {type: Number, default: 0},
    'longitude': {type: Number, default: 0},
    'subscription': {type: Boolean, default: false},
	'active': {type: Boolean, default: true},
});

module.exports = mongoose.model('user', userSchema);
