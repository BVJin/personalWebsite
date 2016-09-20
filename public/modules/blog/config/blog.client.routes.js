'use strict';

//Setting up route
angular.module('blog').config(['$stateProvider',
	function($stateProvider) {
		// Blog state routing
		$stateProvider.
		state('blog', {
			url: '/blog',
			templateUrl: 'modules/blog/views/blog.client.view.html'
		});
	}
]);
