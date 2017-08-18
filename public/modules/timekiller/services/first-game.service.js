'use strict';

//Menu service used for managing  menus
angular.module('timekiller').service('firGameSvc', [

	function() {

    var renderer, stage, id, snake = {};
    var grid_size, tail_count, apple_x, apple_y, trail, tail;
    var state;
    this.initGame = function (container) {

        snake.snake_x = snake.snake_y = 15;
        snake.x_v = snake.x_y = 0;
        grid_size = 60;
        tail_count = 15;
        apple_x = apple_y = 10;
        trail = [];
        tail = 5;

        //Create the renderer
        renderer = PIXI.autoDetectRenderer(
          900, 900,
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
        if ( i == trail.length - 1 ) {
          curPart = new PIXI.Sprite(id["snake-head.png"]);
        } else if ( i == 0 ) {
          curPart = new PIXI.Sprite(id["snake-tail.png"]);
        } else {
          curPart = new PIXI.Sprite(id["snake-body.png"]);
        };
        curPart.width = 60;
        curPart.height = 60;
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

      // ========= Set up apple/goal for snake =========
      var apple = new PIXI.Sprite(id["snake-body.png"]);
      // Apple
      if ( apple_x == snake.snake_x && apple_y == snake.snake_y ) {
        tail++;
        apple_x = Math.floor(Math.random() * tail_count);
        apple_y = Math.floor(Math.random() * tail_count);        
      };

      apple.width = 60;
      apple.height = 60;
      apple.position.set(apple_x * grid_size, apple_y  * grid_size);
      curApple.addChild(apple);

      // ========= Set up text such as score =========
      var message = new PIXI.Text(
        "Score: " + tail,
        {fontFamily: "Arial", fontSize: 16, fill: "black"}
      );

      message.position.set(820, 30);
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
