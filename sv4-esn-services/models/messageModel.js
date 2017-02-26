var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var messageSchema = new Schema({	'sender' : {	 	type: Schema.Types.ObjectId,	 	ref: 'user'	},	'receivers' : Array,	'message' : String,	'sent_at' : Date});

module.exports = mongoose.model('message', messageSchema);
