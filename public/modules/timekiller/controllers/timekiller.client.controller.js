'use strict';

angular.module('timekiller').controller('TimekillerController', ['$scope', 'firGameSvc', 'secondGameSvc', 'thirdGameSvc', 
	function( $scope, firGame, secGame, thiGame ) {

		var container1 = document.getElementById('first-game');
		secGame.initGame(container1);

	}
]);
