'use strict';

angular.module('blog').controller('BlogController', ['$scope', '$anchorScroll', '$location', '$q', '$filter', 'BlogService', 'Authentication', '$interval', '$state','$stateParams',
	function($scope, $anchorScroll, $location, $q, $filter, blogSvc, Authentication, $interval, $state, $stateParams) {
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

		var ifEdit = $stateParams.edit;

		console.log($stateParams);
		/**
			* Deployment
			*/
		//deploy book select
		function deployBookSelect(){
			var deferred = $q.defer();
			blogSvc.listBook().$promise.then(function(data){
				$scope.books = data;
				//set default book as Misc
				if(!ifEdit)
					$scope.selectedBook = $filter('filter')(data, {name:"Misc"}, true)[0];
				else
					$scope.selectedBook = $filter('filter')(data, {name:$stateParams.book.name}, true)[0];
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

		if(!ifEdit)
			loadDraft();
		else
			$scope.articleObj = $stateParams.article;

		/**
			* Functions
			*/
		//if user select a new book, assuming they want to put this article to that new book
		//so ask them if they want to delete the article at old book.
		//if it is the same book, use put to update article infomation
		$scope.submitArticle = function(){
			$scope.articleObj.bookId = $scope.selectedBook.bookId;
			if(!ifEdit || $stateParams.book.bookId != $scope.selectedBook.bookId){
				//create article to nwew book
				blogSvc.createArticle($scope.articleObj).then(function(data){
					//pop up for asking if delete the article in old book

					//update UI
					$scope.submitSuccess = true;
				}, function(err){
					console.log('Creating article failed');
					console.log(err);
				});
			}else{
				//same book, using PUT to update
			}

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
