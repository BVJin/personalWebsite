'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		window.user.isAdmin = window.user.roles.indexOf('admin') > -1;
		_this._data = {
			user: angular.copy(window.user)
			//authToken: $localSotrage.authToken
		};

		return _this._data;
	}
]);
