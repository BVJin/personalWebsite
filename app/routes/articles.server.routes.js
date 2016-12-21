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
  app.route('/articles')
    .get(articles.read)
    .post(api_auth.isAuthenticated, articles.create)
    .put(api_auth.isAuthenticated, articles.update)
    .delete(api_auth.isAuthenticated, articles.delete);

};
