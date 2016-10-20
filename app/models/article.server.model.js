'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
	// Article model fields
	bookId: {
			type: Number,
			required: 'Book cannot be none'
	},

	articleId: {
			type: Number,
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

	title: {
		type: String,
		default: '',
		required: 'Article name cannot be blank'
	},

	content: {
			type: String,
			default: ''
	}

});

mongoose.model('Article', ArticleSchema);
