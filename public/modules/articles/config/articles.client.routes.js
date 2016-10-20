'use strict';

//Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider
		.state('articles', {
			url: '/articles?bookId&articleId',
			templateUrl: 'modules/articles/views/articles.client.view.html'
		});
	}
]);
