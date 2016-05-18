'use strict';

//Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider
		.state('articles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/articles.client.view.html'
		})
		.state('toughWorkers', {
				url: '/articles/toughWorkers',
				templateUrl: 'modules/articles/views/articles/tough_workers.client.view.html'
		});
	}
]);
