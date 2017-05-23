'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		//if has current user, check if user is admin
		if(window.user)
			window.user.isAdmin = window.user.roles?window.user.roles.indexOf('admin') > -1 : false;
		_this._data = {
			user: angular.copy(window.user)
			//authToken: $localSotrage.authToken
		};

		return _this._data;
	}
]);
