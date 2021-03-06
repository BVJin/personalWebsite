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
			trail = [];
			tail = 5;
			// AI snake
			ai_snake.snake_x = 0;
			ai_snake.snake_y = 19;
			ai_snake.head_direction = "right", ai_snake.tail_direction = "right";
			ai_snake.x_v = ai_snake.x_y = 0;
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

    	// Containers for each componet on tage
    	var curSnake, curAISnake, curApple, curMess;
		var isGameEnd = false;

	    function gameLoop() {
			setTimeout(function() {
				requestAnimationFrame(gameLoop);
			}, 1000 / 15);

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

			setUpPlayerSnake();
			setUpAISnake();
			setUpApple();
			setUpGameMessgae();
	    }


		/*
			Game intial setting functions
		*/
		function setUpPlayerSnake() {
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
					endGame();
			    };
			};

			curSnake.addChild(curPart);

			};

			// move the snake
			trail.push({x:snake.snake_x, y: snake.snake_y});

			while ( trail.length > tail ) {
				trail.shift();
			};
		};

		function setUpAISnake() {
			// ========= Set up AI snake =========
			// In order to have a perfect snake, I am assuming the sanke body will fill all grids
			// which means, theoretically the head will meet tail at the last step.
			// If the snake cannot get the food (no path between the food and head), move with the longest path from head to tail(building the cycle)
			// If the snake get the food and will trap (head cannot reach to tail) itself,
			// we should let it do the longest path from head and tail. If it won't trap, move with the shrotest path.
			// If all options are not avaiable, move with step farthest from head to food.
			/* =========== steps ==========
				1. Shorest path P1 from head to food, yes, go to 2, no, go to 3
				2. After snake get the food, longest path P2 from head to tail, yes, move with P1 shortest path, no, go to 3
				3. Before snake get the food, longest path P3 from head to tail, yes, move with the P3 longest path, no, go to 4
				4. Move with the step that farthest between head and food
			   ============================
			   P1 --> shortest path, snake head to apple
			   P2 --> shortest path, snake after eating apple, head to tail
			   P3 --> longest path,  snake head to apple
			   P4 --> shortest path, snake head to tail (for computing the longest path)
			   P5 --> longest path,  snake head to tail
			*/
			var P1 = [], P2 = [], P3 = [], P4 = [], P5=[];
			//if ( ai_trail.length > 0 ) {
			var nextStep;

			if ( findShortestPath(ai_snake.snake_x, ai_snake.snake_y, apple_x, apple_y, ai_trail, P1) ) {
				// If snake is not built completely move with shortesr path
				if ( ai_trail.length >= 5 ) {
					// Compute the tail position after get the food
					// Update the snake body
					var new_snake = angular.copy(ai_trail);
					for (var i = 0; i < P1.length; i++) {
						var new_x = new_snake[new_snake.length-1].x + P1[i].xv > tail_count - 1 ? 0 : new_snake[new_snake.length-1].x + P1[i].xv < 0 ? tail_count - 1 : new_snake[new_snake.length-1].x + P1[i].xv;
						var new_y = new_snake[new_snake.length-1].y + P1[i].xy > tail_count - 1 ? 0 : new_snake[new_snake.length-1].y + P1[i].xy < 0 ? tail_count - 1 : new_snake[new_snake.length-1].y + P1[i].xy;
						new_snake.push({x:new_x, y: new_y});
						new_snake.shift();
					};
					// If no shortest path means no longest path, the worst case shortest path = longest path
					if ( findShortestPath(apple_x, apple_y, new_snake[0].x, new_snake[0].y, new_snake, P2) ) {
						nextStep = P1[0];
					} else {
						if ( findShortestPath(ai_snake.snake_x, ai_snake.snake_y, ai_trail[0].x, ai_trail[0].y, ai_trail, P4) ) {
							P5 = findLongestPath(ai_snake.snake_x, ai_snake.snake_y, ai_trail[0].x, ai_trail[0].y, ai_trail, P4);
							if ( P5.length > 1 ) {
								nextStep = P5[0];
							} else {
								nextStep = countFarthestSteps(ai_snake.snake_x, ai_snake.snake_y, apple_x, apple_y, ai_trail, true);
							}
						} else {
							nextStep = countFarthestSteps(ai_snake.snake_x, ai_snake.snake_y, apple_x, apple_y, ai_trail, true);
						}	
					};
				} else {
					nextStep = P1[0];
				}
				
				

			} else {
				if ( findShortestPath(ai_snake.snake_x, ai_snake.snake_y, ai_trail[0].x, ai_trail[0].y, ai_trail, P4) ) {
					P5 = findLongestPath(ai_snake.snake_x, ai_snake.snake_y, ai_trail[0].x, ai_trail[0].y, ai_trail, P4);
					if ( P5.length > 1 ) {
						nextStep = P5[0];
					} else {
						nextStep = countFarthestSteps(ai_snake.snake_x, ai_snake.snake_y, apple_x, apple_y, ai_trail, false);
					}
				} else {
					nextStep = countFarthestSteps(ai_snake.snake_x, ai_snake.snake_y, apple_x, apple_y, ai_trail, false);
				}				
			};

			if (nextStep) {
				ai_snake.snake_x = ai_snake.snake_x + nextStep.xv > tail_count - 1 ? 0 : ai_snake.snake_x + nextStep.xv < 0 ? tail_count - 1 : ai_snake.snake_x + nextStep.xv;
				ai_snake.snake_y = ai_snake.snake_y + nextStep.xy > tail_count - 1 ? 0 : ai_snake.snake_y + nextStep.xy < 0 ? tail_count - 1 : ai_snake.snake_y + nextStep.xy;
				
				if (nextStep.xv == 1) ai_snake.head_direction = "right";
				if (nextStep.xv == -1) ai_snake.head_direction = "left";
				if (nextStep.xy == 1) ai_snake.head_direction = "down";
				if (nextStep.xy == -1) ai_snake.head_direction = "up";
			};
				

				//}


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
			    	// ai_tail = 5;
			    	endGame();
			    };

	        	curAISnake.addChild(curPart);
	      	};

			// move the snake
			ai_trail.push({x:ai_snake.snake_x, y: ai_snake.snake_y});

			while ( ai_trail.length > ai_tail ) {
				ai_trail.shift();
			};
		};

		function setUpApple() {
			// ========= Set up apple/goal for snake =========
			var apple = new PIXI.Sprite(id["apple.png"]);
			// Apple should not appear inside of snake body
			var snake_coord = [];
			//var snake_xs = [], snake_ys = [];
			var left_coord = [];
			// exclude player snake body
			for ( var i = 0; i < trail.length; i++ ) {
				snake_coord.push({x:trail[i].x, y:trail[i].y});
			};
			// exclude ai snake body
			for ( var i = 0; i < ai_trail.length; i++ ) {
				snake_coord.push({x:ai_trail[i].x, y:ai_trail[i].y});
			};

			snake_coord.push({x:apple_x, y:apple_y});

			for ( var i = 0; i < tail_count; i++ ) {
					for (var j = 0; j < tail_count; j++ ) {
						if (!$filter('filter')(snake_coord, {x : i, y : j}, true)[0]) {
							left_coord.push({x:i, y:j});
						};
					};
			};
			// Player takes the target
			if ( apple_x == snake.snake_x && apple_y == snake.snake_y ) {
				tail++;
				var coord = left_coord[Math.floor(Math.random() * left_coord.length)];
				apple_x = coord.x;
				apple_y = coord.y;
			};
			// AI takes the target
			if ( apple_x == ai_snake.snake_x && apple_y == ai_snake.snake_y ) {
				ai_tail++;
				var coord = left_coord[Math.floor(Math.random() * left_coord.length)];
				apple_x = coord.x;
				apple_y = coord.y;;
			};

			apple.width = grid_size;
			apple.height = grid_size;
			apple.position.set(apple_x * grid_size, apple_y  * grid_size);
			curApple.addChild(apple);
		};

		function setUpGameMessgae() {
			// ========= Set up text such as score =========
			var message = new PIXI.Text(
				"Score: " + tail,
				{fontFamily: "Arial", fontSize: 16, fill: "black"}
			);

			message.position.set(520, 30);
			curMess.addChild(message);
		};

		/*
			Game funtions like binding keyboard events
		*/
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


		/*
			AI snake algorithm, base on A star and Graph Search
		*/
		// A star path finding for shortest path
		// Hamilton cycle for longest path
		function findShortestPath (origin_x, origin_y, target_x, target_y, curSnakeTrail, steps) {
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

			// avoid to kill itself
			for ( var i = 0; i < curSnakeTrail.length; i++ ) {
				grids[curSnakeTrail[i].x][curSnakeTrail[i].y].visited = true;
			};

			// avido to hit the player snake
			for ( var i = 0; i < trail.length; i++ ) {
				grids[trail[i].x][trail[i].y].visited = true;
			};

			grids[origin_x][origin_y].visited = true;
			grids[target_x][target_y].visited = false;

			// Intial the first step base on type
			var initStep = {x:origin_x, y:origin_y};
			openList = $filter('orderBy')(countNextSteps(initStep, target_x, target_y, curLvl, grids), ["f", "h"]);
			// A star shortest path finding algorithm
			while( openList.length > 0 ) {
				var nextStep = openList.shift();
				// When the current path has higher f then the recored step, it should go back to the pervious level
				curLvl = nextStep.g;

				//  if hit the apple
				if ( nextStep.x  == target_x  && nextStep.y == target_y ){
					var curStep = nextStep;

					while ( curStep.parent ) {
						steps.unshift(curStep);
						curStep = curStep.parent;
					};

					return true;
				};

				var nextMoves = countNextSteps(nextStep, target_x, target_y, curLvl + 1, grids);

				// if there is next move
				if ( nextMoves.length > 0 ) {
					openList = $filter('orderBy')(openList.concat(nextMoves), ["f", "h"]);
				};
			};
			return false;
			
		};
		// Since the find longest path is a NP-hard problem, so we need use some heuristic function to find the "longest" path
		// Hamilton path backtracking
		// x y 				 --> start vertex coordinate
		// target_x target_y --> end vertex corrdinate
		// lvl 				 --> how many steps have been taken
		// grids 			 --> record visited status
		// goal 			 --> how many vertexs we are planning to visit (all the grids except snake's body and head)
		// steps 			 --> record theh hamilton path
		function hamiltonCycle ( x, y, target_x, target_y, lvl, grids, goal, steps ) {
			// If this is the last step and the last step is right on the target, means the hamilton path is existing
			if ( lvl == goal - 1 ) {
				if ( steps[goal-1] && steps[goal-1].x == target_x && steps[goal-1].y == target_y ) {
					return true;
				} else {
					return false;
				}
			}

			let nextSteps = countNextSteps(x, y, target_x, target_y, lvl, grids, "longest");

			// Go through all the next steps
			angular.forEach(nextSteps, function(nextStep){
				if (lvl != goal-2 && (nextStep.x == target_x && nextStep.y == target_y))
					return false;
				// Set the current step's visited status as true to avoid visit again
				grids[nextStep.x][nextStep.y].visited = true;
				steps[lvl] = nextStep;
				// if find the path
				if ( hamiltonCycle(nextStep.x, nextStep.y, target_x, target_y, lvl+1, grids, goal, steps) ) {
					return true;
				}; 
				// if not find the path, reverse the process, which means set the previous step at grid as false
				// and remove the step in steps (not necessary acutally, it will get overwritten)
				grids[nextStep.x][nextStep.y].visited = false;
				steps[lvl] = null;

			});

			return false;
		};

		//	Find the shorest path first and then extend every pair that is able to extend 
		function findLongestPath ( origin_x, origin_y, target_x, target_y, curSnakeTrail, shortPath ) {

			var longPath = angular.copy(shortPath);
			//  Add the start vertex to the path
			longPath.unshift({x:origin_x, y:origin_y});

			var grids = []; // grid size
			for ( var i = 0; i < tail_count; i++ ) {
				grids[i] = [];
				for ( var j = 0; j < tail_count; j++ ) {
					grids[i].push({"visited" : false});
				}

			};
			// avoid to kill itself
			for ( var i = 0; i < curSnakeTrail.length; i++ ) {
				grids[curSnakeTrail[i].x][curSnakeTrail[i].y].visited = true;
			};

			// avoid to crash on player
			for ( var i = 0; i < trail.length; i++ ) {
				grids[trail[i].x][trail[i].y].visited = true;
			};

			// set the short path as visted
			for ( var i = 0; i < longPath.length; i++ ) {
				grids[longPath[i].x][longPath[i].y].visited = true;
			};

			//  if index is equal the last step, means there is no more to extend
			var index = 0;
			while ( index != longPath.length - 1 ) {
				for ( index = 0; index < longPath.length; index++ ) {
					if ( index == longPath.length - 1 ) {
						break;
					} else {
						// if we have the extend steps, we insert it into index and index + 1
						// and then redo the while
						let extend_steps = [];
						if ( ifInsert(extend_steps, grids, index, longPath) ) {

							angular.forEach(extend_steps, function(step){
								grids[step.x][step.y].visited = true;
							});

							longPath = longPath.slice(0, index + 1).concat(extend_steps).concat(longPath.slice(index + 1));
							break
						};

					};

				};
			};

			longPath.shift();
			return longPath;

		};

		//  If the grid can take the two steps to next one, it is considered as a extension
		function ifInsert ( extend_steps, grids, index, longPath ) {
			var tempSteps = [
				{x:-1, y:0},
				{x:1, y:0},
				{x:0, y:1},
				{x:0, y:-1}
			];

			angular.forEach(tempSteps, function (step1) {
				// first step
				var firstStep = {
					x  : longPath[index].x + step1.x > tail_count-1 ? 0 : longPath[index].x + step1.x < 0 ? tail_count-1 : longPath[index].x + step1.x,
					y  : longPath[index].y + step1.y > tail_count-1 ? 0 : longPath[index].y + step1.y < 0 ? tail_count-1 : longPath[index].y + step1.y,
					xv : step1.x,
					xy : step1.y
				};

				if ( !grids[firstStep.x][firstStep.y].visited ) {
					angular.forEach(tempSteps, function (step2) {
						// second step
						var secondStep = {
							x : firstStep.x + step2.x > tail_count-1 ? 0 : firstStep.x + step2.x < 0 ? tail_count-1 : firstStep.x + step2.x,
							y : firstStep.y + step2.y > tail_count-1 ? 0 : firstStep.y + step2.y < 0 ? tail_count-1 : firstStep.y + step2.y,
							xv : step2.x,
							xy : step2.y
						};

						//  if second step can hit the next path step with one hit
						if ( !grids[secondStep.x][secondStep.y].visited && 
							( (Math.abs(secondStep.x - longPath[index+1].x) == 1 && secondStep.y == longPath[index+1].y) || (Math.abs(secondStep.y - longPath[index+1].y) == 1 && secondStep.x == longPath[index+1].x) ) ) {
							extend_steps.push(firstStep);
							extend_steps.push(secondStep);
						};

					});

				};

			});

			return extend_steps.length > 0;

		};

		//  Type is not matter's here because if we are finding the longest path
		//  the only thing matter is the coordinates x and y, the rest will just for the A star algorithm
		//  But for the grids visted true/false, since hamilton cycle is doing the recursion, we should set
		//  the true/false inside of algorithm
		function countNextSteps (prevStep, target_x, target_y, lvl, grids) {
			var x = prevStep.x;
			var y = prevStep.y
			let nextSteps = [];

			var tempSteps = [
				{x:-1, y:0},
				{x:1, y:0},
				{x:0, y:1},
				{x:0, y:-1}
			];

			angular.forEach(tempSteps, function(step){
				var cur_x = x + step.x > tail_count-1 ? 0 : x + step.x < 0 ? tail_count-1 : x + step.x;
				var cur_y = y + step.y > tail_count-1 ? 0 : y + step.y < 0 ? tail_count-1 : y + step.y;
				if ( !grids[cur_x][cur_y].visited ) {
					// Since our snake can cross the wall, so we need to count the step cost when snake cross vertically and horizontatly
					// and use the min/max result for the next step

					// vertical cross h
					var ver_h = Math.abs(cur_x - target_x) + tail_count - Math.abs(cur_y - target_y);
					// horizontal cross h
					var hor_h = tail_count - Math.abs(cur_x - target_x) + Math.abs(cur_y- target_y);
					// regular h
					var reg_h = Math.abs(cur_x - target_x) + Math.abs(cur_y- target_y);
					// min h
					var min_h = Math.min(ver_h, hor_h, reg_h);

					var obj = { x : cur_x, y : cur_y, xv: step.x, xy: step.y, g : lvl, parent: prevStep};

					obj.h = min_h;

					obj.f = obj.g + obj.h;
					nextSteps.push(obj);
					grids[cur_x][cur_y].visited = true;
				}
			});
			return nextSteps;

		};

		// If it has path at first palce, choose the "farther" step which has path
		// If it has not, just choose the farthest step
		function countFarthestSteps (x, y, target_x, target_y, curSnakeTrail, ifHasPath) {
			let nextSteps = [];

			var tempSteps = [
				{x:-1, y:0},
				{x:1, y:0},
				{x:0, y:1},
				{x:0, y:-1}
			];

			var grids = []; // grid size
			for ( var i = 0; i < tail_count; i++ ) {
				grids[i] = [];
				for ( var j = 0; j < tail_count; j++ ) {
					grids[i].push({"visited" : false});
				}

			};

			// exclude the snake body
			for ( var i = 0; i < curSnakeTrail.length; i++ ) {
				grids[curSnakeTrail[i].x][curSnakeTrail[i].y].visited = true;
			};

			// exclude the player snake body
			for ( var i = 0; i < trail.length; i++ ) {
				grids[trail[i].x][trail[i].y].visited = true;
			};

			angular.forEach(tempSteps, function(step){
				var cur_x = x + step.x > tail_count-1 ? 0 : x + step.x < 0 ? tail_count-1 : x + step.x;
				var cur_y = y + step.y > tail_count-1 ? 0 : y + step.y < 0 ? tail_count-1 : y + step.y;
				if ( !grids[cur_x][cur_y].visited ) {
					// Since our snake can cross the wall, so we need to count the step cost when snake cross vertically and horizontatly
					// and use the min/max result for the next step

					// vertical cross h
					var ver_h = Math.abs(cur_x - target_x) + tail_count - Math.abs(cur_y - target_y);
					// horizontal cross h
					var hor_h = tail_count - Math.abs(cur_x - target_x) + Math.abs(cur_y- target_y);
					// regular h
					var reg_h = Math.abs(cur_x - target_x) + Math.abs(cur_y- target_y);
					// max h
					var max_h = Math.max(ver_h, hor_h, reg_h);

					var obj = { x : cur_x, y : cur_y, xv: step.x, xy: step.y};

					obj.h = max_h;

					nextSteps.push(obj);
					grids[cur_x][cur_y].visited = true;
				}
			});
			
			nextSteps = $filter("orderBy")(nextSteps, "-h");
			if ( ifHasPath ) {
				for ( var i = 0; i < nextSteps.length; i++ ) {
					var shortPath = []
					if ( findShortestPath(nextSteps[i].x, nextSteps[i].y, target_x, target_y, curSnakeTrail, shortPath) ) {	
						return nextSteps[i];
					};
				};
			};

			return nextSteps[0];

		};

		

	}
]);
