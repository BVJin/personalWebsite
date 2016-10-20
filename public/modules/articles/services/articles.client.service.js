'use strict';

angular.module('articles').service('ArticlesService', ['$resource', '$q',
	function($resource, $q) {

    this.listArticleByBook = function(bookId){
      var url = "/articles/listByBook?bookId=" + bookId;
      return $resource(url).query();
    };

    this.listArticleById = function(articleId){
      var url = "/articles/listByArticle?articleId=" + articleId;
      return $resource(url).get();
    };

		this.listBookById = function(bookId){
			var url = "/books?bookId=" + bookId;
			return $resource(url).get();
		}

	}
]);
