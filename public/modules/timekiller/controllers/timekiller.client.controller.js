'use strict';

angular.module('timekiller').controller('TimekillerController', ['$scope', 'firGameSvc', 'secondGameSvc',
	function( $scope, firGame, secGame ) {

		var container1 = document.getElementById('first-game');
		firGame.initGame(container1);

	}
]);
