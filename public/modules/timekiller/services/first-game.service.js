'use strict';

//Menu service used for managing  menus
angular.module('timekiller').service('firGameSvc', ['$filter',

	function($filter) {

		var game_container;

    var renderer, stage, id, snake = {}, ai_snake={};
    var grid_size, tail_count, apple_x, apple_y, trail, tail, ai_trail, ai_tail;
    var state;

		// buttons
		var start_button, start_text;
		var end_box, end_text, gameEndMessgae;

    this.initGame = function (container) {
				game_container = container;


        //Create the renderer
        renderer = PIXI.autoDetectRenderer(
          600, 600,
          {antialias: false, transparent: false, resolution: 1}
        );
        renderer.view.style.border = "1px dashed black";

        renderer.backgroundColor = 0xffffff;

        //Add the canvas to the HTML document
        game_container.appendChild(renderer.view);

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
					initParams();
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

		function initParams () {
			// clean the stage
			while(stage.children[0]) { stage.removeChild(stage.children[0]); }

			// user's snake
			snake.snake_x = snake.snake_y = 20;
			snake.head_direction = "right", snake.tail_direction = "right";
			snake.x_v = 1;
			snake.x_y = 0;
			snake.isStop = false;
			trail = [];
			tail = 5;
			// AI snake
			ai_snake.snake_x = 0;
			ai_snake.snake_y = 19;
			ai_snake.head_direction = "right", ai_snake.tail_direction = "right";
			ai_snake.x_v = ai_snake.x_y = 0;
			ai_snake.isStop = false;
			ai_trail = [];
			ai_tail = 5;

			// other settings
			grid_size = 30;
			tail_count = 20;
			apple_x = apple_y = 10;

			if ( end_box )
				stage.removeChild(end_box);
			if ( end_text )
				stage.removeChild(end_text);
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
			//findPath();
      gameLoop();
    };

    var curSnake, curAISnake, curApple, curMess;
		var isGameEnd = false;
    function gameLoop() {
      setTimeout(function() {
        requestAnimationFrame(gameLoop);
      }, 1000 / 10)
			if ( !isGameEnd ) {
	      state();
			};

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
			if ( !snake.isStop ) {
		    snake.snake_x += snake.x_v;
	      snake.snake_y += snake.x_y;
			}
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

				//  if hit own'body
        if ( trail[i].x == snake.snake_x && trail[i].y == snake.snake_y ) {
					gameEndMessgae = "AI won, you score is " + tail + ", AI score is " + ai_tail;
					endGame();
        };
				// if hit the AI's body
				for ( var j = 0; j < ai_trail.length; j++ ) {
					if ( ai_trail[j].x == snake.snake_x && ai_trail[j].y == snake.snake_y ) {
						//  if it is head to head, compare the length
						if ( j == ai_trail.lenght - 1 ) {
							if ( ai_tail > tail ) {
								gameEndMessgae =  "AI won, you score is " + tail + ", AI score is " + ai_tail;
							} else if ( ai_tail < tail ) {
								gameEndMessgae =  "You won, you score is " + tail + ", AI score is " + ai_tail;
							} else {
								gameEndMessgae =  "Draw, you score is " + tail + ", AI score is " + ai_tail;
							};
						}
						gameEndMessgae = "AI won, you score is " + tail + ", AI score is " + ai_tail;
	          //tail = 5;
						endGame();
	        };
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
			var nextStep;
			if ( !ai_snake.isStop ) {
				nextStep = findPath();
	      ai_snake.snake_x += nextStep.xv;
	      ai_snake.snake_y += nextStep.xy;
			}

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

			// head direction
			if ( nextStep ) {
				if (nextStep.xv == 1) ai_snake.head_direction = "right";
				if (nextStep.xv == -1) ai_snake.head_direction = "left";
				if (nextStep.xy == 1) ai_snake.head_direction = "down";
				if (nextStep.xy == -1) ai_snake.head_direction = "up";
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
      // Apple should not appear inside of snake body
			var snake_xs = [], snake_ys = [];
			var left_xs = [], left_ys = [];
			// exclude player snake body
			for ( var i = 0; i < trail.length; i++ ) {
				snake_xs.push(trail[i].x);
				snake_ys.push(trail[i].y);
			};
			// exclude ai snake body
			for ( var i = 0; i < ai_trail.length; i++ ) {
				snake_xs.push(ai_trail[i].x);
				snake_ys.push(ai_trail[i].y);
			};

			for ( var i = 0; i < tail_count; i++ ) {
					if ( snake_xs.indexOf(i) == -1 ) {
						left_xs.push(i);
					};

					if ( snake_ys.indexOf(i) == -1 ) {
						left_ys.push(i);
					};
			};
			// Player takes the target
      if ( apple_x == snake.snake_x && apple_y == snake.snake_y ) {
        tail++;
        apple_x = left_xs[Math.floor(Math.random() * left_xs.length)];
        apple_y = left_ys[Math.floor(Math.random() * left_ys.length)];
      };
			// AI takes the target
			if ( apple_x == ai_snake.snake_x && apple_y == ai_snake.snake_y ) {
        ai_tail++;
        apple_x = left_xs[Math.floor(Math.random() * left_xs.length)];
        apple_y = left_ys[Math.floor(Math.random() * left_ys.length)];
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


		function endGame () {
			isGameEnd = true;
			// End box
			end_box = new PIXI.Graphics();

			end_box.lineStyle(2, 0x87CEFA, 1);
			end_box.drawRoundedRect(100, 200, 400, 70, 20);
			end_box.interactive = true;
			end_box.buttonMode = true;
			end_box.hitArea = start_button.getBounds();
			end_box.click = function () {
				isGameEnd = false;
				initParams();
			};

			end_text = new PIXI.Text(
				gameEndMessgae,
				{fontFamily: "Arial", fontSize: 20, fill: "#87CEFA"}
			);
			end_text.position.set(150, 220);

			stage.addChild(end_box);
			stage.addChild(end_text);
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


		// A star path finding
		function findPath () {
			var steps = [];

			//  every level have a list to represent current lvl options
			var lvlList = [];
			// open list will get all the possible steps and compare the least f out of here
			var openList = [];

			var curLvl = 1;

			var grids = []; // grid size
			for ( var i = 0; i < tail_count; i++ ) {
				grids[i] = [];
				for ( var j = 0; j < tail_count; j++ ) {
					grids[i].push({"visited" : false});
				}

			};

			grids[ai_snake.snake_x][ai_snake.snake_y].visited = true;

			// avoid to kill itself
			for ( var i = 0; i < ai_trail.length; i++ ) {
				grids[ai_trail[i].x][ai_trail[i].y].visited = true;
			};
			// avido to hit the player snake
			for ( var i = 0; i < trail.length; i++ ) {
				grids[trail[i].x][trail[i].y].visited = true;
			};

			// Intial the first step
			openList = $filter('orderBy')(countNextSteps(ai_snake.snake_x, ai_snake.snake_y, curLvl), ["f", "h"]);

			//console.log(openList);
			while( openList.length > 0 ) {
				var nextStep = openList.shift();
				// When the current path has higher f then the recored step, it should go back to the pervious level
				curLvl = nextStep.g;
				// record the step to the steps
				steps[curLvl-1] = angular.copy(nextStep);
				//  if hit the apple
				if ( ((nextStep.x - 1 == apple_x || nextStep.x + 1 == apple_x) && nextStep.y == apple_y) || ((nextStep.y - 1 == apple_y || nextStep.y + 1 == apple_y) && nextStep.x == apple_x)){
					steps.push({x : apple_x, y : apple_y, xv : 0, xy : 0});
					return steps[0];
				};

				var nextMoves = countNextSteps(nextStep.x, nextStep.y, curLvl + 1);

				// if there is next move
				if ( nextMoves.length > 0 ) {
					openList = $filter('orderBy')(openList.concat(nextMoves), ["f", "h"]);
				// if the snake is trapped, it should do the max steps in the trap area
				};
			};

			function countNextSteps (x, y, lvl) {
				let nextSteps = [];

				var tempSteps = [
					{x:-1, y:0},
					{x:1, y:0},
					{x:0, y:1},
					{x:0, y:-1},
				];

				angular.forEach(tempSteps, function(step){
					var cur_x = x + step.x > tail_count-1 ? 0 : x + step.x < 0 ? tail_count-1 : x + step.x;
					var cur_y = y + step.y > tail_count-1 ? 0 : y + step.y < 0 ? tail_count-1 : y + step.y;
					if ( !grids[cur_x][cur_y].visited ) {
						// Since our snake can cross the wall, so we need to count the step cost when snake cross vertically and horizontatly
						// and use the min result for the next step

						// vertical cross h
						var ver_h = Math.abs(cur_x - apple_x) + tail_count - Math.abs(cur_y - apple_y);
						// horizontal cross h
						var hor_h = tail_count - Math.abs(cur_x - apple_x) + Math.abs(cur_y- apple_y);
						// regular h
						var reg_h = Math.abs(cur_x - apple_x) + Math.abs(cur_y- apple_y);
						// min h
						var min_h = Math.min(ver_h, hor_h, reg_h);

						var obj = { x : cur_x, y : cur_y, xv: cur_x - x, xy: cur_y - y, g : lvl, h : min_h };
						obj.f = obj.g + obj.h;
						nextSteps.push(obj);
						grids[cur_x][cur_y].visited = true;
					}
				});

				return nextSteps;

			};

			return steps[0];
		};

	}
]);
