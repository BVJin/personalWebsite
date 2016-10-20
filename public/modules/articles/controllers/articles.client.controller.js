'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$filter', "NgTableParams", "BlogService", "ArticlesService", '$stateParams',
	function($scope, $filter, NgTableParams, blogSvc, articlesSvc, $stateParams) {
		//for loading content spinner
		$scope.loading = {};


		//if has article ID in url, show the article
		if($stateParams.articleId){
			articlesSvc.listArticleById($stateParams.articleId).$promise.then(function(article){
				if(article.articleId > -1){
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
				//set "Misc" as default book
				if(!$stateParams.bookId){
					$scope.currentBook = $filter('filter')(data, {name: "Misc"}, true)[0];
				}else{
					$scope.currentBook = $filter('filter')(data, {bookId: parseInt($stateParams.bookId)}, true)[0];
				}
				$scope.loading.book = false;
				updateArticles();
			}, function(err){
				console.log(err);
			})
		}

		//
		function updateArticles(){
				$scope.loading.articles = true;
				articlesSvc.listArticleByBook($scope.currentBook.bookId).$promise.then(function(data){
					$scope.articles = data;
					$scope.loading.articles = false;
				}, function(err){
					console.log(err);
				})
		}



		$scope.pickBook = function(book){
			//update CSS and var
			$scope.currentBook = book;
			//update articles list
			updateArticles();
		}



		$scope.test = function(){
			console.log($scope.currentBook);
		}
	}
]);
