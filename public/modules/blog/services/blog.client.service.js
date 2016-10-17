'use strict';

angular.module('blog').service('BlogService', ['$resource', '$q',
	function($resource, $q) {

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

	}
]);
