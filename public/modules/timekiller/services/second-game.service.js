'use strict';

//Menu service used for managing  menus
angular.module('timekiller').service('secondGameSvc', [

	function() {

    var renderer, stage, id, worker;
    var state;
    this.initGame = function (container) {
        //Create the renderer
        renderer = PIXI.autoDetectRenderer(
          1200, 600,
          {antialias: false, transparent: false, resolution: 1}
        );
        renderer.view.style.border = "1px dashed black";

        renderer.backgroundColor = 0xffffff;

        PIXI.loader
    	  .add("modules/timekiller/images/walking-spritesheet.json")
    	  .add("modules/timekiller/images/walking-spritesheet.png")
    	  .load(setup);

        //Add the canvas to the HTML document
        container.appendChild(renderer.view);

        //Create a container object called the `stage`
        stage = new PIXI.Container();

    };

    function setup() {

      id = PIXI.loader.resources["modules/timekiller/images/walking-spritesheet.json"].textures;
			//
			// var background_road = new PIXI.Sprite(id["road-1.png"]).texture;
			// var tilingSprite = new PIXI.extras.TilingSprite(background_road, renderer.width, renderer.height);
			// tilingSprite.y = 100;
			//
			// stage.addChild(tilingSprite);

      worker = new PIXI.Sprite(id["walking-right-1.png"]);
			worker.y = 350;
      worker.vx = 0;
      worker.vy = 0;

      stage.addChild(worker);

      var right = keyboard(39),
					left= keyboard(37);
      // right
      right.press = function() {
        worker.vx = 5;;
        worker.vy = 0;
      };

      right.release = function() {
        if ( worker.vy == 0 && !left.isDown) {
            worker.vx = 0;
        };

      }

			// left
			left.press = function() {
        worker.vx = -5;
        worker.vy = 0;
      };

      left.release = function() {
        if ( worker.vy == 0 && !right.isDown) {
            worker.vx = 0;
        };

      }

      //Set the game state
      state = play;

      gameLoop();
    };

    function gameLoop() {
      requestAnimationFrame(gameLoop);
      state();
      renderer.render(stage);
    }

    function play() {

      worker.x += worker.vx;
      // move to the right
      if ( worker.vx > 0 && worker.x % 25 == 0 ) {
        var walkingId = parseInt(worker.texture.textureCacheIds[0].charAt(worker.texture.textureCacheIds[0].length-5));
        walkingId = walkingId == 8 ? 1 : walkingId + 1;
        worker.texture = new PIXI.Sprite(id["walking-right-" + walkingId + ".png"]).texture;
      };

			// move to the left
			if ( worker.vx < 0 && worker.x % 25 == 0 ) {
        var walkingId = parseInt(worker.texture.textureCacheIds[0].charAt(worker.texture.textureCacheIds[0].length-5));
        walkingId = walkingId == 8 ? 1 : walkingId + 1;
        worker.texture = new PIXI.Sprite(id["walking-left-" + walkingId + ".png"]).texture;
      };

      worker.y += worker.vy
    }

    function keyboard(keyCode) {
      var key = {};
      key.code = keyCode;
      key.isDown = false;
      key.isUp = true;
      key.press = undefined;
      key.release = undefined;
      //The `downHandler`
      key.downHandler = function(event) {
        if (event.keyCode === key.code) {
          if (key.isUp && key.press) key.press();
          key.isDown = true;
          key.isUp = false;
        }
        event.preventDefault();
      };

      //The `upHandler`
      key.upHandler = function(event) {
        if (event.keyCode === key.code) {
          if (key.isDown && key.release) key.release();
          key.isDown = false;
          key.isUp = true;
        }
        event.preventDefault();
      };

      //Attach event listeners
      window.addEventListener(
        "keydown", key.downHandler.bind(key), false
      );
      window.addEventListener(
        "keyup", key.upHandler.bind(key), false
      );
      return key;
    };


	}
]);
