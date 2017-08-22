'use strict';

//Menu service used for managing  menus
angular.module('timekiller').service('firGameSvc', [

	function() {

    var renderer, stage, id, snake = {}, ai_snake={};
    var grid_size, tail_count, apple_x, apple_y, trail, tail, ai_trail, ai_tail;
    var state;

		// buttons
		var start_button, start_text;
    this.initGame = function (container) {

				// user's snake
        snake.snake_x = snake.snake_y = 20;
				snake.head_direction = "right", snake.tail_direction = "right";
        snake.x_v = snake.x_y = 0;
				trail = [];
        tail = 5;
				// AI snake
				ai_snake.snake_x = ai_snake.snake_y = 19;
				ai_snake.head_direction = "right", ai_snake.tail_direction = "right";
				ai_snake.x_v = 1;
				ai_snake.x_y = 0;
				ai_trail = [];
        ai_tail = 5;

				// other settings
        grid_size = 30;
        tail_count = 20;
        apple_x = apple_y = 10;




        //Create the renderer
        renderer = PIXI.autoDetectRenderer(
          600, 600,
          {antialias: false, transparent: false, resolution: 1}
        );
        renderer.view.style.border = "1px dashed black";

        renderer.backgroundColor = 0xffffff;

        //Add the canvas to the HTML document
        container.appendChild(renderer.view);

        //Create a container object called the `stage`
        stage = new PIXI.Container();

				// Home page buttons
				start_button = new PIXI.Graphics();

				start_button.lineStyle(2, 0x87CEFA, 1);
				start_button.drawRoundedRect(200, 200, 200, 70, 15);
				start_button.interactive = true;
				start_button.buttonMode = true;
				start_button.hitArea = start_button.getBounds();
				start_button.click = function () {
					stageRemoveAllButtons();
					PIXI.loader
	    	  .add("modules/timekiller/images/snake.json")
	    	  .load(setup);
				};

				start_text = new PIXI.Text(
					"Play Game",
  				{fontFamily: "Arial", fontSize: 25, fill: "#87CEFA"}
				);
				start_text.position.set(240, 220);

				stage.addChild(start_button);
				stage.addChild(start_text);

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

    var curSnake, curAISnake, curApple, curMess;
    function gameLoop() {
      setTimeout(function() {
        requestAnimationFrame(gameLoop);
      }, 1000 / 10)
      state();
      stage.addChild(curSnake);
			stage.addChild(curAISnake);
      stage.addChild(curApple);
      stage.addChild(curMess);
      renderer.render(stage);
    }

    function play() {

      //  Remove child cotainers instead of destory the container
      stage.removeChild(curSnake);
			stage.removeChild(curAISnake);
      stage.removeChild(curApple);
      stage.removeChild(curMess);

      //  Re define those containers
      curSnake = new PIXI.Container();
			curAISnake = new PIXI.Container();
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

				// Tail direction is not like head, it can't be decided by the button press, since it
				// will change the direction until the tail's x y changed, before that, follow the
				// previous direction.
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

      // move the snake
      trail.push({x:snake.snake_x, y: snake.snake_y});

      while ( trail.length > tail ) {
        trail.shift();
      };

			// ========= Set up AI snake =========
      ai_snake.snake_x += ai_snake.x_v;
      ai_snake.snake_y += ai_snake.x_y;
      if ( ai_snake.snake_x < 0 ) {
          ai_snake.snake_x = tail_count - 1;
      };

      if ( ai_snake.snake_x > tail_count - 1 ) {
          ai_snake.snake_x = 0;
      };

      if ( ai_snake.snake_y < 0 ) {
          ai_snake.snake_y = tail_count - 1;
      };

      if ( ai_snake.snake_y > tail_count - 1 ) {
          ai_snake.snake_y = 0;
      };

      for ( var i = 0; i < ai_trail.length; i++ ) {
        var curPart;

				// Tail direction is not like head, it can't be decided by the button press, since it
				// will change the direction until the tail's x y changed, before that, follow the
				// previous direction.
				if ( i == 0 ) {
					// Initial previous x and y of snake's tail
					ai_snake.tail_px = ai_snake.tail_px ? ai_snake.tail_px : ai_trail[0].x;
					ai_snake.tail_py = ai_snake.tail_py? ai_snake.tail_py : ai_trail[0].y;

					if ( ai_snake.tail_px == ai_trail[0].x + 1 ) {
						ai_snake.tail_direction = "left";
					} else if ( ai_snake.tail_px == ai_trail[0].x - 1 ) {
						ai_snake.tail_direction = "right";
					} else if ( ai_snake.tail_py == ai_trail[0].y + 1 ) {
						ai_snake.tail_direction = "up";
					} else if ( ai_snake.tail_py == ai_trail[0].y - 1 ) {
						ai_snake.tail_direction = "down";
					} else {
						ai_snake.tail_direction = "right";
					}

					ai_snake.tail_px = ai_trail[0].x;
					ai_snake.tail_py = ai_trail[0].y;

					curPart = new PIXI.Sprite(id["snake-tail-" + ai_snake.tail_direction + ".png"]);
				} else if ( i == ai_trail.length - 1 ) {
          curPart = new PIXI.Sprite(id["snake-head-" + ai_snake.head_direction + ".png"]);
        } else {
          curPart = new PIXI.Sprite(id["snake-body.png"]);
        };

				curPart.width = grid_size;
				curPart.height = grid_size;
				curPart.position.set(ai_trail[i].x * grid_size, ai_trail[i].y * grid_size);

        if ( ai_trail[i].x == ai_snake.snake_x && ai_trail[i].y == ai_snake.snake_y ) {
          ai_tail = 5;
        };
        //console.log(curPart);
        curSnake.addChild(curPart);
      };

      // move the snake
      ai_trail.push({x:ai_snake.snake_x, y: ai_snake.snake_y});

      while ( ai_trail.length > ai_tail ) {
        ai_trail.shift();
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


		//   functions
		function stageRemoveAllButtons() {
			stage.removeChild(start_button);
			stage.removeChild(start_text);
		};

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
