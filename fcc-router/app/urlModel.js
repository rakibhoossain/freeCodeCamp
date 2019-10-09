let mongoose = require('mongoose');

let urlSchema = mongoose.Schema({
	"original_url": {
		type: String
	},
	"short_url": {
		type: Number
	}
});

module.exports = mongoose.model('ShortUrl', urlSchema);