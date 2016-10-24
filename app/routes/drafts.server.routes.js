'use strict';

module.exports = function(app) {
	// Routing logic
	var drafts = require('../../app/controllers/drafts.server.controller'),
			api_auth = require('../../app/controllers/api.authentication.server.controller');

	app.route('/drafts').get(api_auth.isAuthenticated, drafts.read);
  app.route('/drafts').put(api_auth.isAuthenticated, drafts.update);
	app.route('/books').post(api_auth.isAuthenticated, drafts.create);
};
