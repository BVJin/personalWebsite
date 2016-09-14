'use strict';

module.exports = function(app) {
	// Routing logic
	//var books = require('../../app/controllers/books.server.controller');
	var books = require('../../app/controllers/books.server.controller');
	app.route('/books')
		.get(books.list)
		.post(books.create);
};
