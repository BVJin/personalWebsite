'use strict';


module.exports = function(app) {
	// Routing logic
	var books = require('../../app/controllers/books.server.controller'),
			api_auth = require('../../app/controllers/api.authentication.server.controller');

	app.route('/books').get(books.list);
	app.route('/books').post(api_auth.isAuthenticated, books.create);
};
