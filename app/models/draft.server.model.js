'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Draft Schema
 */
var DraftSchema = new Schema({
	// Draft model fields
	userId: {
			type: String,
			unique: true
	},

	created: {
			type: Date,
			default: Date.now
	},

	modified: {
			type: Date,
			default: Date.now
	},

	content: {
			type: String,
			default: ''
	},

	title: {
		type: String,
		default: ''
	}
});

mongoose.model('Draft', DraftSchema);
