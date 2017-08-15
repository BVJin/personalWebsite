'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$state', '$stateParams' ,'$http','$window','$location',
	function($scope, Authentication, Menus, $state, $stateParams, $http, $window, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.signout = function(){
			$http.get('/auth/signout').success(function(){
				$window.location.reload();
			}).error(function(err){

			});
		}

		$scope.goToPage = function(state){

			//clean url
			$location.search({});
			//clean state parameters
			Object.keys($stateParams).forEach(function(key){ delete $stateParams[key]});
			$state.go(state, {}, { reload: true });
		}
		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.state = $state;
	}
]);
