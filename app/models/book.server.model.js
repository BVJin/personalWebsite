'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Book Schema
 */
var BookSchema = new Schema({
	// Book model fields
	// property name
	bookId: {
			type: Number,
			unique: true
	},

	created: {
			type: Date,
			default: Date.now
	},

	description: {
			type: String,
			default: ''
	},

	name: {
		type: String,
		default: '',
		required: 'Book name cannot be blank'
	}
});

mongoose.model('Book', BookSchema);
