'use strict';

// Setting up route
angular.module('core')

.run(function($rootScope, $state, $stateParams){
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
        $rootScope.ifHideFooter = $state.params.ifHideFooter;
        $rootScope.ifHideHeader = $state.params.ifHideHeader;
    })
})

.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);