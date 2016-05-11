'use strict';

angular.module('articles').controller('ArticlesController', ['$scope',
	function($scope) {
		$scope.myInterval = 5000;
	  $scope.noWrapSlides = false;
	  $scope.active = 0;
		var currIndex = 0;
		$scope.slides = [
			{
				image: '/modules/articles/img/theToughWorkers_background.jpg',
				text: 'The tough workers',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				id: currIndex++
			},
			{
				image: '/modules/articles/img/theToughWorkers_background.jpg',
				text: 'The tough workers',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				id: currIndex++
			}
		]
	}
]);
