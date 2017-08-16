'use strict';

angular.module('timekiller').controller('TimekillerController', ['$scope',
	function($scope) {

		var container = document.getElementById('game-container');

		//Create the renderer
		var renderer = PIXI.autoDetectRenderer(
		  256, 256,
		  {antialias: false, transparent: false, resolution: 1}
		);
		renderer.view.style.border = "1px dashed black";

		PIXI.loader
	  .add("modules/timekiller/images/dog1.jpg")
	  .add("modules/timekiller/images/dog2.jpg")
	  .load(setup);
		//Add the canvas to the HTML document
		container.appendChild(renderer.view);

		//Create a container object called the `stage`
		var stage = new PIXI.Container();

		//Tell the `renderer` to `render` the `stage`


		function setup() {
			var dog1 = new PIXI.Sprite(
				PIXI.loader.resources['modules/timekiller/images/dog1.jpg'].texture
			);

			//dog1.x = 96;
			function gameLoop() {

			  //Loop this function at 60 frames per second
			  requestAnimationFrame(gameLoop);

			  //Move the cat 1 pixel to the right each frame
			  dog1.x += 1;

			  //Render the stage to see the animation
			  renderer.render(stage);
			}

			//Start the game loop
			gameLoop();
			stage.addChild(dog1);
			renderer.render(stage);
		};

	}
]);
