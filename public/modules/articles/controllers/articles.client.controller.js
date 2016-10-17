'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$filter', "NgTableParams", "BlogService",
	function($scope, $filter, NgTableParams, blogSvc) {

		//for loading content spinner
		$scope.loading = {};

		//get book list
		blogSvc.listBook().$promise.then(function(data){
			$scope.books = data;
			//set "Misc" as default book
			$scope.currentBook = $filter('filter')(data, {name: "Misc"}, true)[0];
			$scope.loading.book = false;
		}, function(err){
			console.log(err);
		})

		$scope.pickBook = function(book){
			//update CSS and var
			$scope.currentBook = book;
			//update articles list
		}

		$scope.test = function(){
			console.log($scope.currentBook);
		}
	}
]);
