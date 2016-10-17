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
		unique: true,
		required: 'Book name cannot be blank'
	},

	ifDelete: {
		type: Boolean,
		default: true
	}
});

mongoose.model('Book', BookSchema);
