'use strict';

angular.module('blog').controller('BlogController', ['$scope', '$anchorScroll', '$location', '$q', '$filter', 'BlogService',
	function($scope, $anchorScroll, $location, $q, $filter, blogSvc) {
		//book object
		$scope.bookObj = {};
		//article object
		$scope.articleObj = {};
		//warning message show/hide in the page
		$scope.warning = {};
		//control popover
		$scope.isPopoverOpen = false;

		//deploy book select
		function deployBookSelect(){
			var deferred = $q.defer();
			blogSvc.listBook().$promise.then(function(data){
				$scope.books = data;
				//set default book as Misc
				$scope.selectedBook = $filter('filter')(data, {name:"Misc"}, true)[0];
				deferred.resolve(data);
			}, function(err){
				deferred.reject("It is a dead game");
			})
			return deferred.promise;
		}
		deployBookSelect();

		$scope.submitArticle = function(){

			$scope.articleObj.bookId = $scope.selectedBook.bookId
			blogSvc.createArticle($scope.articleObj).then(function(data){
				//update UI
				$scope.submitSuccess = true;
			}, function(err){
				console.log(err);
			});
		}

		//if preview/submit article without Title
		$scope.noTitle = function(){
			$scope.warning.ifTitleWarning = true;
			$location.hash('titleWarning');
			$anchorScroll();
		}

		//create book button at popover
		$scope.createBook = function(){
			blogSvc.createBook($scope.bookObj).then(function(data){
				//update book selector list
				deployBookSelect().then(function(res){
					//set the select to the created book
					$scope.selectedBook = data;
					//close popover
					$scope.isPopoverOpen = false;
				}, function(err){
					console.log(err);
				});

			}, function(err){
				console.log(err);
				$scope.warning.ifBookWarning = true;
			})
		}

	}
]);
