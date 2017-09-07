'use strict';

angular.module('timekiller').controller('TimekillerSnakeController', ['$scope', 'firGameSvc', 'secondGameSvc', 'thirdGameSvc', 
	function( $scope, firGame, secGame, thiGame ) {
		var container1 = document.getElementById('first-game');
		firGame.initGame(container1);
	}
]);
