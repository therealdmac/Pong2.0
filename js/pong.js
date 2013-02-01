 /**
 * Initialize the Game and start it
 */
//objectpool = new Array();
var game = new Game();

var objects = new CreateObjects();

var d = new Date();
var time1 = 0;
var time2 = 0;

// debug flag
var debugFlag = 0;

// calculate frames per second
var fps = 0, now, lastUpdate = (new Date)*1 - 1;

// The higher this value, the less the FPS will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
var fpsFilter = 10;

function drawFrame(){
  // ... draw the frame ...

  var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
  fps += (thisFrameFPS - fps) / fpsFilter;
  lastUpdate = now;

  setTimeout( drawFrame, 1 );
}

var fpsOut = document.getElementById('fps');
setInterval(function(){
  fpsOut.innerHTML = fps.toFixed(1) + "fps";
}, 1000);


// debug 
function debugTool() {


	// mainBall location
	document.getElementById("mbX").innerHTML=(game.mainball.x).toFixed(1); 
	document.getElementById("mbY").innerHTML=(game.mainball.y).toFixed(1); 
	document.getElementById("mbSx").innerHTML=(game.mainball.speedX).toFixed(1);
	document.getElementById("mbSy").innerHTML=(game.mainball.speedY).toFixed(1); 

	setTimeout("debugTool()", 500);
}

	function showDebug() {

		document.getElementById("debug").style.display = 'block';
		document.getElementById("debug-status").innerHTML = 'ON';
		debugFlag = 1;
	}

	function hideDebug() {
		document.getElementById("debug").style.display = 'none';
		document.getElementById("debug-status").innerHTML = 'OFF';
		debugFlag = 0;
	}

/*
function startTimer() {
	time1++;
	//console.log('getMilliseconds returns ' +d.getMilliseconds());
	document.getElementById("result").innerHTML=time1; 
	setTimeout("startTimer()", 1);
	  
}

function startTimer2() {
	time2++;
	setTimeout("startTimer2()", 1000);
	document.getElementById("result2").innerHTML=time2;   
}*/


function init() {
	if(game.init())
		game.start();
} 

function restartGame() {
	//if (game.mainball.y > game.mainball.bottomEdge)

	//	document.location.reload();
}

function startWorker() {
	console.log('entered startworkers');

	if(typeof(Worker)!=="undefined")
	  {
	    if(typeof(w)=="undefined")
	  {
	    w = new Worker("js/webworkers.js");

	  }

	  // when web workers return a message
	  w.onmessage = function (event) {
	    document.getElementById("result3").innerHTML=event.data;
	    };
	  }
	else
	  {
	  document.getElementById("result3").innerHTML="Sorry, your browser does not support Web Workers...";
	  }
}

function stopWorker() { 
  w.terminate();
}



/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a 
 * singleton.
 */
var imageRepository = new function() {

	// Define images
	this.background = new Image();
	this.paddle = new Image();
	this.mainball = new Image();
	this.enemyball = new Image();
	this.shooter = new Image();

	// Ensure all images have loaded before starting the game
	var numImages = 5;
	var numLoaded = 0;

	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	}
	this.paddle.onload = function() {
		imageLoaded();
	}
	this.mainball.onload = function() {
		imageLoaded();
	}
	this.enemyball.onload = function() {
		imageLoaded();
	}
	this.shooter.onload = function() {
		imageLoaded();
	}

	// Set images src
	this.background.src = "imgs/bg.png";
	this.paddle.src = "imgs/paddle.png";
	this.mainball.src = "imgs/main_ball.png";
	this.enemyball.src = "imgs/enemy_ball.png";
	this.shooter.src = "imgs/shooter.png";
}


 /**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on browsers that do not support the canvas.
	 */
	this.init = function() {

		// Get the canvas elements
		this.bgCanvas = document.getElementById('background');
		this.paddleCanvas = document.getElementById('paddle');
		this.mainCanvas = document.getElementById('main');

		// Test to see if canvas is supported. Only need to
		// check one canvas
		if (this.bgCanvas.getContext) {

			this.bgContext = this.bgCanvas.getContext('2d');
			this.paddleContext = this.paddleCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');

			// Initialize objects to contain their context and canvas
			// information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Paddle.prototype.context = this.paddleContext;
			Paddle.prototype.canvasWidth = this.paddleCanvas.width;
			Paddle.prototype.canvasHeight = this.paddleCanvas.height;

			Ball.prototype.context = this.mainContext;
			Ball.prototype.canvasWidth = this.mainCanvas.width;
			Ball.prototype.canvasHeight = this.mainCanvas.height;

			Shooter.prototype.context = this.paddleContext;
			Shooter.prototype.canvasWidth = this.paddleCanvas.width;
			Shooter.prototype.canvasHeight = this.paddleCanvas.height;
	

			// Initialize the background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0

			
			this.Pool = new ObjectPool(10);
			// Initialize the paddle object
			//this.paddle = new Paddle();
			this.paddle = this.Pool.CreateObj(1);

			// Set the paddle to start near the bottom middle of the canvas
			var paddleStartX = this.paddleCanvas.width/2 - imageRepository.paddle.width;
			var paddleStartY = this.paddleCanvas.height - imageRepository.paddle.height;
			this.paddle.init(paddleStartX, paddleStartY, imageRepository.paddle.width,
			               imageRepository.paddle.height);

			// Initialize the mainball object
			//this.mainball = new Mainball();
			//this.mainball2 = new Mainball();
			//this.enemyball = new Enemyball();
			this.mainball = this.Pool.CreateObj(0);
			this.mainball2 = this.Pool.CreateObj(0);
			this.enemyball = this.Pool.CreateObj(3);


			//this.enemyball = createEnemyBalls();

			/*

			for(var i=0; i<2; i++) {

				objectpool[i] = createEnemyBalls();

				console.log('objectPool[i] speeed is ' +objectpool[i].speed);

				objectpool[i].init(100+i*50, 10, imageRepository.mainball.width, imageRepository.mainball.height);

				objectpool[i].draw();

				objectpool[i].

			}  */
			

			// Set the mainball to start at middle
			var mainballStartX = this.mainCanvas.width/2 - imageRepository.mainball.width;
			var mainballStartY = this.mainCanvas.height/10;

			this.mainball.init(mainballStartX, mainballStartY, imageRepository.mainball.width, imageRepository.mainball.height);

			this.mainball2.init(0, 0, imageRepository.mainball.width, imageRepository.mainball.height);

			this.enemyball.init(100, 10, imageRepository.mainball.width, imageRepository.mainball.height);

			// Initialize the Shooter
			this.shooter = new Shooter();
			var shooterStartX = this.paddleCanvas.width/2 - imageRepository.shooter.width;
			var shooterStartY = 0;
			this.shooter.init(shooterStartX, shooterStartY, imageRepository.shooter.width,
			               imageRepository.paddle.height);
			

			

			return true;
		} else {
			return false;
		}
	};

	// Start the animation loop
	this.start = function() {
		//alert('Start Game?');

		// draw everything first round
		

		this.background.draw();
		//this.paddle.draw();
		//this.mainball.draw();
		//this.mainball2.draw();
		//this.enemyball.draw();
		this.shooter.draw();
		this.Pool.draw();

		//console.log('this.enemyball.leftEdge is ' +this.enemyball.leftEdge);

		// start the animation loop
		animate();

	};
}


/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
	requestAnimFrame( animate );
	
	// Rendering 
	//game.mainball.draw();
	//game.mainball2.draw();
	//game.paddle.move();
	//game.enemyball.draw();

	game.Pool.animate();
	game.shooter.move();

	if(debugFlag) {
		debugTool();
	}

	collisionDetection();

	drawFrame();
	
}



/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){

	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();


