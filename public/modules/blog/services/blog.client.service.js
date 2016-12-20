'use strict';

angular.module('blog').service('BlogService', ['$resource', '$q',
	function($resource, $q) {
		/**
		 * Book part
		 */
    //Create Book
    this.createBook = function(bookInfo){

      var url = "/books";
			var deferred = $q.defer();
			//auto increment id
			this.listBook().$promise.then(function(res){

				if(res.length == 0)
					bookInfo.bookId = 0
				else
					bookInfo.bookId = res[res.length-1].bookId + 1;

				//store book
				$resource(url).save(bookInfo).$promise.then(function(data){
					deferred.resolve(data);
				}, function(err){
					deferred.reject(err);
				});

			});

			return deferred.promise;

    }

		//List Book
		this.listBook = function(){
			var url = "/books";
			return $resource(url).query();
		}

		//create article
		this.createArticle = function(articleInfo){
			var create_url = "/articles";
			var list_url = "/articles/listAll";

			var deferred = $q.defer();
			//auto increment id
			$resource(list_url).query().$promise.then(function(res){

				if(res.length == 0)
					articleInfo.articleId = 0
				else
					articleInfo.articleId = res[res.length-1].articleId + 1;

				//store article
				$resource(create_url).save(articleInfo).$promise.then(function(data){
					deferred.resolve(data);
				}, function(err){
					deferred.reject(err);
				});

			})
			return deferred.promise;
		}

		/**
		 * Draft part
		 */
		this.createDraft = function(draftInfo){
			var url = "/drafts";
			return $resource(url).save(draftInfo).$promise.then(function(data){
				//create draft successfully
			}, function(err){
				console.log(err);
			});
		}

		this.updateDraft = function(draftInfo){
			var url = "/drafts";
			return $resource(url, draftInfo, {
				'update': {method: 'PUT'}
			});
		}

		this.getDraft = function(userId){
			var url = "/drafts?userId=" + userId;
			return $resource(url).get();
		}

	}
]);
