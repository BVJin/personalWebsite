'use strict';

angular.module('blog').controller('BlogController', ['$scope', '$anchorScroll', '$location', '$q', '$filter', 'BlogService', 'Authentication', '$interval',
	function($scope, $anchorScroll, $location, $q, $filter, blogSvc, Authentication, $interval) {
		/**
			* Variables
			*/
		//user
		$scope.authentication = Authentication.user;
		//book object
		$scope.bookObj = {};
		//article object
		$scope.articleObj = {};
		//draft object
		$scope.draftObj = {};
		//warning message show/hide in the page
		$scope.warning = {};
		//control popover
		$scope.isPopoverOpen = false;

		/**
			* Deployment
			*/
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

		//Pre-load draft
		function loadDraft(){
			blogSvc.getDraft($scope.authentication._id).$promise.then(function(res){
				if(res.userId){
					$scope.draftObj = res;
				}else{
					//create draft
					$scope.draftObj.userId = $scope.authentication._id;
					blogSvc.createDraft($scope.draftObj);
				}
			},function(err){
				console.log(err);
			})
		}
		deployBookSelect();
		loadDraft();

		/**
			* Functions
			*/
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

		//Auto save draft every 2 mins
		var autoSave = $interval(function(){
			$scope.draftObj.userId = $scope.authentication._id;
			$scope.draftObj.content = $scope.articleObj.content;
			$scope.draftObj.title = $scope.articleObj.title;
			blogSvc.updateDraft($scope.draftObj).update($scope.draftObj);
		}, 1000*100)

	}
]);
