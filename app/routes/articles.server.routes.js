'use strict';

module.exports = function(app) {
	// Routing logic
  var articles = require('../../app/controllers/articles.server.controller'),
			api_auth = require('../../app/controllers/api.authentication.server.controller');

  //list articles
  app.route('/articles/listAll').get(articles.listAll);
  //list articles by book
  app.route('/articles/listByBook').get(articles.listByBookId);
  //list articles by article
  app.route('/articles/listByArticle').get(articles.listByArticleId);
  //create article
	app.route('/articles/createArticle').post(api_auth.isAuthenticated, articles.create);

};
