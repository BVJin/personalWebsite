'use strict';

angular.module('blog').controller('BlogController', ['$scope', '$anchorScroll', '$location', '$q', '$filter', '$uibModal', 'BlogService', 'notifySvc', 'Authentication', '$interval', '$state', '$stateParams',
	function($scope, $anchorScroll, $location, $q, $filter, $uibModal, blogSvc, notifySvc, Authentication, $interval, $state, $stateParams) {
		/**
			* Variables
			*/
		//user
		$scope.authentication = Authentication.user;
		//book object
		$scope.bookObj = {};
		//article object
		$scope.articleObj = {
			"title":'',
			"content":''
		};
		//draft object
		$scope.draftObj = {};
		//warning message show/hide in the page
		$scope.warning = {};
		//switch to preview and editor
		$scope.flags = {};

		var ifEdit = $stateParams.edit;

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


		/**
			* Functions
			*/

		//if user select a new book, assuming they want to put this article to that new book
		//if it is the same book, use put to update article infomation
		$scope.submitArticle = function(){
			$scope.articleObj.bookId = $scope.selectedBook.bookId;
			if(!ifEdit || $stateParams.book.bookId != $scope.selectedBook.bookId){
				//remove _id and _v
				var reqData = {
					"bookId": $scope.articleObj.bookId,
					"title": $scope.articleObj.title,
					"content": $scope.articleObj.content
				}
				//create article to nwew book
				blogSvc.createArticle(reqData).then(function(data){
					//update UI
					$scope.flags.submitSuccess = true;
				}, function(err){
					notifySvc.error(err.data.message);
					console.log(err);
				});
			}else{
				//same book, using PUT to update
				blogSvc.updateArticles($scope.articleObj).update($scope.articleObj).$promise.then(function(){
					$scope.flags.submitSuccess = true;
				}, function(err){
					notifySvc.error(err.message);
					console.log(err);
				});
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
					$scope.flags.isPopoverOpen = false;
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





		////////////////////////
		/*
		**Intialiazation
		*/
		deployBookSelect();
		if(!ifEdit){
			loadDraft();
		}else{
			 $interval.cancel(autoSave);
			 $scope.articleObj = $stateParams.article;
		};

		//this flag for refire the event which has been preventDefault
		var ifLeave = false;
		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			if($scope.articleObj.title != '' || $scope.articleObj.content != ''){
				if(!ifLeave)
					event.preventDefault();
				var modalInstance = $uibModal.open({
					 animation: true,
					 controller: '',
					 template:  //'<div class="container">'
					 							'<div style="width:100%;height:90px;line-height: 90px;"><h4 class="text-center bv-font" style="margin-top: 40px;">You will lose your creation, are you sure you want to leave this page?</h4></div>'
		                    +'<div class="row" style="margin-bottom:10px">'
		                    	+'<button type="button" class="col-md-2 btn bv-btn pull-right" style="margin-right: 20px; width:16.7%;" ng-click="stay()">No</button>'
													+'<button type="button" class="col-md-2 btn bv-btn pull-right" style="margin-right: 20px; width:16.7%;" ng-click="leave()">Yes</button>'
												+'</div>',
											//+'</div>',
					 scope: $scope,
					 size: 'md',
					 resolve: {

					 }
				 });

				 $scope.leave = function(){
					 modalInstance.close();
					 ifLeave = true;
					 $state.go(toState.name, toParams);

				 };

				 $scope.stay = function(){
					 modalInstance.close();
				 };
			}
 		});

	}
]);
