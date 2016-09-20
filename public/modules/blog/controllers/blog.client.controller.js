'use strict';

angular.module('blog').controller('BlogController', ['$scope', '$anchorScroll', '$location',
	function($scope, $anchorScroll, $location) {
		//book object
		$scope.bookObj = {};
		//article object
		$scope.articleObj = {};

		$scope.submitArticle = function(){
			console.log($scope.articleObj);
		}

		$scope.noTitle = function(){
			$scope.ifWarning = true;
			$location.hash('titleWarning');
			$anchorScroll();
		}
	}
]);
