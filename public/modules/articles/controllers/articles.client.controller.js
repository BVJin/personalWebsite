'use strict';

angular.module('articles').controller('ArticlesController', ['$scope',
	function($scope) {
		console.log();
		angular.element(document).ready(function () {
        document.getElementById('test').focus();
    });

		$scope.myInterval = 5000;
	  $scope.noWrapSlides = false;
	  $scope.active = 0;
		var currIndex = 0;
		$scope.slides = [
			{
				image: '/modules/articles/img/theToughWorkers_background.jpg',
				text: 'The tough workers',
				description: 'Mark our life in university',
				id: currIndex++,
				sref: 'toughWorkers'
			},
			{
				image: '/modules/articles/img/essay_background.jpg',
				text: 'Essays',
				description: 'Joy in living',
				id: currIndex++,
				sref: 'essays'
			}
		];
	}
]);
