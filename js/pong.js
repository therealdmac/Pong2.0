 /**
 * Initialize the Game and start it
 */
var game = new Game();

var d = new Date();
var time1 = 0;
var time2 = 0;
var gameTime = 0;

// Keep track of enemy ball

var enemyballPoolonScreen = 0;

// ***************************************** 
// calculate frames per second
// http://stackoverflow.com/questions/5078913/html5-canvas-performance-calculating-loops-frames-per-second
// *****************************************
var fps = 0, now, lastUpdate = (new Date)*1 - 1;

// The higher this value, the less the FPS will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
var fpsFilter = 50;

function checkFPS(){

  var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
  fps += (thisFrameFPS - fps) / fpsFilter;
  lastUpdate = now;

  setTimeout( checkFPS, 1 );
}

var fpsOut = document.getElementById('fps');
setInterval(function(){
  fpsOut.innerHTML = fps.toFixed(1) + "fps";
}, 1000);


// ************************************ 
// debug Tool
// ************************************ 
// debug flag
var debugFlag = 1;

function debugTool() {


	// mainBall location
	document.getElementById("mbX").innerHTML=(game.mainball.x).toFixed(1); 
	document.getElementById("mbY").innerHTML=(game.mainball.y).toFixed(1); 
	document.getElementById("mbSx").innerHTML=(game.mainball.speedX).toFixed(1);
	document.getElementById("mbSy").innerHTML=(game.mainball.speedY).toFixed(1); 


	// shooter debug
	document.getElementById("shooter-Sx").innerHTML=(game.shooter.speed).toFixed(1);

	// How fast to update debugTool
	setTimeout( debugTool, 100);
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

function shootBall() {
	game.shooter.shoot();
}

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
}


function init() {
	if(game.init()) {
		game.start();
	}
		
} 

function restartGame() {
	//if (game.mainball.y > game.mainball.bottomEdge)

	//	document.location.reload();
}

/*************** added by beeb ********************/
var ballMovingDown = false;
var ballMovingRight = false;
var paddleIsInTheRightRegionOfCanvas = false;
var paddleIsInTheLeftRegionOfCanvas = false;
var paddleRegion;//can use game.paddle.x
var currentTime;
var gameTimeElapsed;
var isTimeForManipulation;

function setGameBallYDirection(){
	//If the ball is moving down, it is deemed to have positive direction
	if(game.mainball.speedY > 0){
		game.mainball.ballMovingDown  = true;
	}else{
		game.mainball.ballMovingDown = false;
	}
}
function setGameBallXDirection(){
	//If the ball is moving to the right, it is deemed to have positive direction
	if(game.mainball.speedX > 0){
		game.mainball.ballMovingRight = true;
	}else{
		game.mainball.ballMovingRight = false;
	}
}
function setPaddleCurrentRegion(){
	//console.log('The current paddle location is: ' + game.paddle.x);
	if(game.paddle.x > (game.paddle.canvasWidth / 2)){
		game.paddle.paddleIsInTheRightRegionOfCanvas = true;
		game.paddle.paddleIsInTheLeftRegionOfCanvas = false;
		game.paddle.paddleRegion = "right";
	}else if((game.paddle.x + game.paddle.width ) < (game.paddle.canvasWidth / 2)){
		game.paddle.paddleIsInTheLeftRegionOfCanvas = true;
		game.paddle.paddleIsInTheRightRegionOfCanvas = false;
		game.paddle.paddleRegion = "left";
	}
}
function setGameBallRegion(){
	//Get the region the game ball is in
	if(game.mainball.x < (game.mainball.canvasWidth/2)){
		game.mainball.ballRegion = "left";
	}else{
		game.mainball.ballRegion  = "right";
	}
}
function isTimeForManipulation(){
	//Set the gameBallParameters parameters
	setGameBallYDirection();
	setGameBallXDirection();
	setGameBallRegion();
	setPaddleCurrentRegion();
	//Determine if the gameball be manipulated
	if(game.mainball.ballMovingDown)	
		manipulateGameBall();
}
function manipulateGameBall(){
	switch (game.paddle.paddleRegion){
		case 'left': 	
			console.log('paddle is at the right');	
			if(game.mainball.ballRegion == "right" && game.mainball.collidedwithrightEdge){
				game.mainball.speedY += 8;
				console.log('manipulated! at left');
			}
			break;

		case 'right': 	
			console.log('paddle is at the left');
			if(game.mainball.ballRegion == "left" && game.mainball.collidedwithleftEdge){
				game.mainball.speedY += 8;
				console.log('manipulated! at right');
			}
			break;

		default:  	break;
	}//switch case statement
}
function gameTimer(){
	//currentTime = ;

	//gameTimeElapsed = gameTime - currentTime;
	//If the time elapsed is more than 10 seconds, it is time for manipulation
	//if(gameTimeElapsed > 10)	
	//	isTimeForManipulation();
	if (gameTime > 3) {
		isTimeForManipulation();
	}
	gameTime++;

	setTimeout("gameTimer()", 1000);

	//console.log('game time is ' +gameTime);
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

			// Initialize objects to contain their context and canvas information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Ball.prototype.context = this.mainContext;
			Ball.prototype.canvasWidth = this.mainCanvas.width;
			Ball.prototype.canvasHeight = this.mainCanvas.height;

			Paddle.prototype.context = this.paddleContext;
			Paddle.prototype.canvasWidth = this.paddleCanvas.width;
			Paddle.prototype.canvasHeight = this.paddleCanvas.height;

			Shooter.prototype.context = this.paddleContext;
			Shooter.prototype.canvasWidth = this.paddleCanvas.width;
			Shooter.prototype.canvasHeight = this.paddleCanvas.height;
			
			// Initialise collision handler
			this.colHandler = new CollisionHandler(this.mainCanvas.width, this.mainCanvas.height);
	
			// Initialize the Object Pool		
			this.pool = new ObjectPool(10);	

			// Initialize the objects
			this.mainball = this.pool.CreateObj(0);
			this.enemyball = this.pool.CreateObj(1);
			this.shooter = new Shooter();
			this.paddle = new Paddle();
			
			this.background = new Background();
			

			// *************************
			// Initialize the objects' starting location
			// *************************

			// Background Draw
			this.background.init(0,0); 

			// Initialize the Shooter
			var shooterStartX = this.paddleCanvas.width/2 - imageRepository.shooter.width;
			var shooterStartY = 0;
			this.shooter.init(shooterStartX, shooterStartY, imageRepository.shooter.width,
			               imageRepository.shooter.height);

			// Set the paddle to start near the bottom middle of the canvas
			var paddleStartX = this.paddleCanvas.width/2 - imageRepository.paddle.width;
			var paddleStartY = this.paddleCanvas.height - imageRepository.paddle.height;
			this.paddle.init(paddleStartX, paddleStartY, imageRepository.paddle.width,
			               imageRepository.paddle.height);

			// Mainball starting location
			var mainballStartX = this.mainCanvas.width/2 - imageRepository.mainball.width;
			var mainballStartY = this.mainCanvas.height/10;

			this.mainball.init(mainballStartX, mainballStartY, imageRepository.mainball.width, imageRepository.mainball.height);


			// EnemyBall starting location
			this.enemyball.init(100, 10, imageRepository.enemyball.width, imageRepository.enemyball.height);

			

			return true;
		} else {
			return false;
		}
	};

	// Start the animation loop
	this.start = function() {

		// draw everything first round
		//game.background.draw();
		game.paddle.draw();
		game.shooter.draw();
		game.pool.animate();
		this.pool.draw();

		// Test Frame Per Second
		checkFPS();

		// start the debugging tool
		debugTool();

		// start the animation loop
		animate();

		// start game Timer
		gameTimer();
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
	game.paddle.move();
	game.paddle.draw();
	game.shooter.draw();
	game.pool.animate();
	//for(var i=0; i<game.pool.allObj.length;i++){
	//alert(""+i+" "+game.pool.allObj[i].x+" "+game.pool.allObj[i].y);
	//	for(var j=i+1; j<game.pool.allObj.length;j++){
		//	collisionDetection(game.pool.allObj[i], game.pool.allObj[j]);
		//}
	//}
	game.colHandler.subDivide(game.pool.allObj);
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


