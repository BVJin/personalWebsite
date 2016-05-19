'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', "NgTableParams",
	function($scope, NgTableParams) {
		$scope.currentBook = "";

		



		$scope.test = function(){
			console.log($scope.currentBook);
		}
	}
]);
