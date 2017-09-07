'use strict';

//Setting up route
angular.module('timekiller').config(['$stateProvider',
	function($stateProvider) {
		// Timekiller state routing
		$stateProvider.
		state('timekiller', {
			url: '/timekiller',
			templateUrl: 'modules/timekiller/views/timekiller.client.view.html'
		})
		.state('snake', {
			url: '/timekiller/snake',
			params: { ifHideHeader : true, ifHideFooter : true },
			templateUrl: 'modules/timekiller/views/timekiller.snake.view.html'
		});
	}
]);