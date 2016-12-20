'use strict';

module.exports = function(app) {
	// Routing logic
  var articles = require('../../app/controllers/articles.server.controller'),
			api_auth = require('../../app/controllers/api.authentication.server.controller');

  //list articles
  app.route('/articles/listAll').get(articles.listAll);
  //list articles by book
  app.route('/articles/listByBook').get(articles.listByBookId);
  //read article
  app.route('/articles').get(articles.read);
  //create article
	app.route('/articles').post(api_auth.isAuthenticated, articles.create);
  //delete article
  app.route('/articles').delete(api_auth.isAuthenticated, articles.delete);

};
