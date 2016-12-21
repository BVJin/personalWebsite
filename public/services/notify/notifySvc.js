'use strict';

angular.module('bvSvcs').service('notifySvc', ['notify',
	function(notify) {

    this.error = function(msg){
      notify({
            message: msg,
            classes: 'alert-danger',
            templateUrl: '',
            position: 'center',
            duration: '2000'
        });
    };

    this.success = function(msg){
      notify({
            message: msg,
            classes: 'alert-success',
            templateUrl: '',
            position: 'center',
            duration: '2000'
        });
    };

	}
]);
