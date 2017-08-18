'use strict';

//Menu service used for managing  menus
angular.module('timekiller').service('firGameSvc', [

	function() {

    var renderer, stage, id, snake = {};
    var grid_size, tail_count, apple_x, apple_y, trail, tail;
    var state;
    this.initGame = function (container) {

        snake.snake_x = snake.snake_y = 20;
				snake.head_direction = "right", snake.tail_direction = "right";
        snake.x_v = snake.x_y = 0;
        grid_size = 30;
        tail_count = 20;
        apple_x = apple_y = 10;
        trail = [];
        tail = 5;

        //Create the renderer
        renderer = PIXI.autoDetectRenderer(
          600, 600,
          {antialias: false, transparent: false, resolution: 1}
        );
        renderer.view.style.border = "1px dashed black";

        renderer.backgroundColor = 0xffffff;

        PIXI.loader
    	  .add("modules/timekiller/images/snake.json")
    	  .add("modules/timekiller/images/snake.png")
    	  .load(setup);

        //Add the canvas to the HTML document
        container.appendChild(renderer.view);

        //Create a container object called the `stage`
        stage = new PIXI.Container();
        renderer.render(stage);

    };

    function setup() {

      id = PIXI.loader.resources["modules/timekiller/images/snake.json"].textures;
			//
			// var background_road = new PIXI.Sprite(id["road-1.png"]).texture;
			// var tilingSprite = new PIXI.extras.TilingSprite(background_road, renderer.width, renderer.height);
			// tilingSprite.y = 100;
			//
			// stage.addChild(tilingSprite);


      // key action
      var left= keyboard(37),
          right = keyboard(39),
          up = keyboard(38),
          down = keyboard(40);

      // right
      right.press = function() {
        if( left.isUp && snake.x_v != -1 ) {
          snake.x_v = 1;
          snake.x_y = 0;
					snake.head_direction = "right";
        };

      };

      right.release = function() {
        // if ( worker.vy == 0 && !left.isDown) {
        //     worker.vx = 0;
        // };
      }

			// left
			left.press = function() {
        if ( right.isUp && snake.x_v != 1 ) {
          snake.x_v = -1;
          snake.x_y = 0;
					snake.head_direction = "left";
        };

      };

      left.release = function() {
        // if ( worker.vy == 0 && !right.isDown) {
        //     worker.vx = 0;
        // };
      }

      // up
			up.press = function() {
        if ( down.isUp && snake.x_y != 1 ) {
          snake.x_v = 0;
          snake.x_y = -1;
					snake.head_direction = "up";
        };

      };

      up.release = function() {
        // if ( worker.vy == 0 && !right.isDown) {
        //     worker.vx = 0;
        // };
      }

      // up
			down.press = function() {
        if ( up.isUp && snake.x_y != -1 ) {
          snake.x_v = 0;
          snake.x_y = 1;
					snake.head_direction = "down";
        };

      };

      down.release = function() {
        // if ( worker.vy == 0 && !right.isDown) {
        //     worker.vx = 0;
        // };
      }


      //Set the game state
      state = play;

      gameLoop();
    };

    var curSnake, curApple, curMess;

    function gameLoop() {
      setTimeout(function() {
        requestAnimationFrame(gameLoop);
      }, 1000 / 10)
      state();
      stage.addChild(curSnake);
      stage.addChild(curApple);
      stage.addChild(curMess);
      renderer.render(stage);
    }

    function play() {

      //  Remove child cotainers instead of destory the container
      stage.removeChild(curSnake);
      stage.removeChild(curApple);
      stage.removeChild(curMess);

      //  Re define those containers
      curSnake = new PIXI.Container();
      curApple = new PIXI.Container();
      curMess = new PIXI.Container();

      // ========= Set up snake =========
      snake.snake_x += snake.x_v;
      snake.snake_y += snake.x_y;
      if ( snake.snake_x < 0 ) {
          snake.snake_x = tail_count - 1;
      };

      if ( snake.snake_x > tail_count - 1 ) {
          snake.snake_x = 0;
      };

      if ( snake.snake_y < 0 ) {
          snake.snake_y = tail_count - 1;
      };

      if ( snake.snake_y > tail_count - 1 ) {
          snake.snake_y = 0;
      };

      for ( var i = 0; i < trail.length; i++ ) {
        var curPart;

				if ( i == 0 ) {
					// Initial previous x and y of snake's tail
					snake.tail_px = snake.tail_px ? snake.tail_px : trail[0].x;
					snake.tail_py = snake.tail_py? snake.tail_py : trail[0].y;

					if ( snake.tail_px == trail[0].x + 1 ) {
						snake.tail_direction = "left";
					} else if ( snake.tail_px == trail[0].x - 1 ) {
						snake.tail_direction = "right";
					} else if ( snake.tail_py == trail[0].y + 1 ) {
						snake.tail_direction = "up";
					} else if ( snake.tail_py == trail[0].y - 1 ) {
						snake.tail_direction = "down";
					} else {
						snake.tail_direction = "right";
					}
					
					snake.tail_px = trail[0].x;
					snake.tail_py = trail[0].y;

					curPart = new PIXI.Sprite(id["snake-tail-" + snake.tail_direction + ".png"]);
				} else if ( i == trail.length - 1 ) {
          curPart = new PIXI.Sprite(id["snake-head-" + snake.head_direction + ".png"]);
        } else {
          curPart = new PIXI.Sprite(id["snake-body.png"]);
        };

				curPart.width = grid_size;
				curPart.height = grid_size;
				curPart.position.set(trail[i].x * grid_size, trail[i].y * grid_size);

        if ( trail[i].x == snake.snake_x && trail[i].y == snake.snake_y ) {
          tail = 5;
        };
        //console.log(curPart);
        curSnake.addChild(curPart);
      };

			// var tailWithDirect;
			// if ( ifSameRow || ifSameCol ){
			// 	tailWithDirect = new PIXI.Sprite(id["snake-tail-" + snake.head_direction + ".png"]);
			// 	snake.tail_direction = snake.head_direction;
			// 	console.log("One True : " + ifSameRow + " " + ifSameCol + " " + snake.tail_direction);
			// } else {
			// 	console.log("Two false : " + ifSameRow + " " + ifSameCol + " " + snake.tail_direction);
			// 	tailWithDirect = new PIXI.Sprite(id["snake-tail-" + snake.tail_direction + ".png"]);
			// }
			//
			// tailWithDirect.width = grid_size;
			// tailWithDirect.height = grid_size;
			// tailWithDirect.position.set(temp_tail.x * grid_size, temp_tail.y * grid_size);
			// curSnake.addChild(tailWithDirect);

      // move the snake
      trail.push({x:snake.snake_x, y: snake.snake_y});

      while ( trail.length > tail ) {
        trail.shift();
      };

      // ========= Set up apple/goal for snake =========
      var apple = new PIXI.Sprite(id["apple.png"]);
      // Apple
      if ( apple_x == snake.snake_x && apple_y == snake.snake_y ) {
        tail++;
        apple_x = Math.floor(Math.random() * tail_count);
        apple_y = Math.floor(Math.random() * tail_count);
      };

      apple.width = grid_size;
      apple.height = grid_size;
      apple.position.set(apple_x * grid_size, apple_y  * grid_size);
      curApple.addChild(apple);

      // ========= Set up text such as score =========
      var message = new PIXI.Text(
        "Score: " + tail,
        {fontFamily: "Arial", fontSize: 16, fill: "black"}
      );

      message.position.set(520, 30);
      curMess.addChild(message);

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
