'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$filter', '$uibModal', '$location', 'BlogService', 'ArticlesService', 'notifySvc', '$stateParams', '$state', 'Authentication',
	function($scope, $filter, $uibModal, $location, blogSvc, articlesSvc, notifySvc, $stateParams, $state, Authentication) {

		//if url has bookId and articlet id at same time
		//condisder this as wrong url, reload page without stateparams
		if($stateParams.articleId && $stateParams.bookId){
			$location.search({});
			delete $stateParams.articleId;
			delete $stateParams.bookId;
			$state.go($state.current, {}, {reload: true});
		};

		//Disqus
		$scope.disqusConfig = {
	    'disqus_shortname': 'bvnonesuch-1',
	    'disqus_identifier': 'temp null',
	    'disqus_url': window.location.href
		};

		//for loading content spinner
		$scope.loading = {};
		$scope.flags = {
			"ifDisqus": false
		}
		$scope.user = Authentication.user;
		//if has article ID in url, show the article
		if($stateParams.articleId){
			articlesSvc.listArticleById($stateParams.articleId).$promise.then(function(article){
				if(article.articleId > -1){
					//Disqus setting
					$scope.flags.ifDisqus = true;
					$scope.disqusConfig.disqus_identifier = "article_" + $stateParams.articleId;
					//deploy article
					$scope.ifArticle = true;
					$scope.article = article;
					//find the book Info to present
					articlesSvc.listBookById(article.bookId).$promise.then(function(book){
						$scope.book = book;
					}, function(err){
						console.log(err);
					})
				}else{ //no article exist
					loadBooks();
				}
			}, function(err){
				console.log(err);
				loadBooks();
			});
		}else{
			loadBooks();
		}

		function loadBooks(){
			//get book list
			$scope.loading.book = true;
			blogSvc.listBook().$promise.then(function(data){
				$scope.books = data;
				//set first book as default book
				if(!$stateParams.bookId){
					$scope.currentBook = data[0] ? data[0] : null;
				}else{
					$scope.currentBook = $filter('filter')(data, {bookId: parseInt($stateParams.bookId)}, true)[0];
				}
				$scope.loading.book = false;
				if($scope.currentBook)
					updateArticles();
			}, function(err){
				console.log(err);
			})
		}

		//update article
		function updateArticles(){
				$scope.loading.articles = true;
				articlesSvc.listArticleByBook($scope.currentBook.bookId).$promise.then(function(data){
					$scope.articles = data;
					$scope.loading.articles = false;
				}, function(err){
					console.log(err);
				})
		}


		//pick book
		$scope.pickBook = function(book){
			//update CSS and var
			$scope.currentBook = book;

			//change url
			$state.transitionTo('articles', {bookId: book.bookId}, {
		    location: true,
		    inherit: true,
		    relative: $state.$current,
		    notify: false
			})

			//update articles list
			updateArticles();
		};

		//Edit article
		$scope.editArticle = function(book, article){
			$state.go('blog', {edit: true, book: book, article: article});
		};

		//Delete article
		$scope.deleteArticle = function(article){
			var modalInstance = $uibModal.open({
				 animation: true,
				 controller: '',
				 template:  //'<div class="container">'
				 							'<div style="width:100%;height:90px;line-height: 90px;"><h4 class="text-center bv-font" style="margin-top: 40px;">Are you sure that you want to delete this post?</h4></div>'
	                    +'<div class="row" style="margin-bottom:10px">'
	                    	+'<button type="button" class="col-md-2 btn bv-btn pull-right" style="margin-right: 20px; width:16.7%;" ng-click="dismissInstance()">No</button>'
												+'<button type="button" class="col-md-2 btn bv-btn pull-right" style="margin-right: 20px; width:16.7%;" ng-click="confirmDelete(article)">Yes</button>'
											+'</div>',
										//+'</div>',
				 scope: $scope,
				 size: 'md',
				 resolve: {

				 }
			 });

			 $scope.confirmDelete = function(article){
				 articlesSvc.deleteArticleById(article.articleId).$promise.then(function(res){
					notifySvc.success(res.message);
					//change url
					//this delete the para at stateParams and url
					$location.search({});
					delete $stateParams.articleId;
					$state.go($state.current, {bookId: article.bookId }, {reload: true});
					modalInstance.close();
 				}, function(err){
					notifySvc.error(err.message);
					modalInstance.close();
					console.log(err);
 				});
			};

			$scope.dismissInstance = function(){
				modalInstance.close();
			}

		};

	}
]);
