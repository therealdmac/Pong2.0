/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions. 
 */

function Drawable() {

	this.init = function(x, y, width, height) {
		// Defualt variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
	this.move = function() {
	};
}

// Rectangle class
 function Rectangle() {

 	this.width = 0;
 	this.height = 0;
 // information: width, height
 //paddle and wall will inherit from rectangle
 }
 Rectangle.prototype = new Drawable();
 

 /**
 * Wall class
 */
 
 function Wall() {
	
 }
 Wall.prototype = new Drawable();


 /**
 * Object Pool class
 */
 
 function ObjectPool(m) {
	
	this.maxSize = m;
	this.allObj = [];
	
	this.CreateObj = function(i){
		
		var newObj = CreateObjects(i);
		this.allObj.push(newObj);
		return newObj;
	}
	this.DeleteObj = function(i){
		this.allObj.splice(i,1);
	}
	this.draw = function(i){
		for(var i=0; i<this.allObj.length; i++)
			this.allObj[i].draw();
	}
	this.animate = function(i){
		for(var i=0; i<this.allObj.length; i++){
			this.allObj[i].move();
			this.draw();
		}
	}
 }

	function CreateObjects(i) {
		switch(i){
		case 1:
			return new Enemyball();
			break;
		case 0:
			return new Mainball();
			break;
		}		
	}

/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background" canvas 
 */
function Background() {

	// Implement abstract function
	this.draw = function() {
		// Pan background
		//this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();



/**
 * Create the Paddle object that the player controls. The paddle is
 * drawn on the "paddle" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Paddle() {

	this.speed = 4;

	/******************** added by beeb **************/
	this.paddleIsInTheRightRegionOfCanvas = false;
	this.paddleIsInTheLeftRegionOfCanvas = false;
	this.paddleRegion = null;
	/******************** added by beeb **************/

	this.draw = function() {
		this.context.drawImage(imageRepository.paddle, this.x, this.y);
	};

	this.move = function() {	


		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right) {
			// The ship moved, so erase it's current image so it can be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);

			// detect keypress
			if (KEY_STATUS.left) {
				this.x -= this.speed;
				// Keep player within the screen
				if (this.x <= 0) 
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed;
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} 

			// Finish by redrawing the paddle
			this.draw();
		}
	};
}
Paddle.prototype = new Rectangle();


function Shooter() {

	this.enemyballPool = 10;

	this.speed = -0.2;

	this.draw = function() {

		// clear current image
		this.context.clearRect(this.x, this.y, this.width, this.height);

		// move according to speed's direction
		this.x += this.speed;

		if (this.x < 10) {
			this.speed = -this.speed;
		} else if (this.x >= this.canvasWidth - this.width) {
			this.speed = -this.speed;
		}

		this.context.drawImage(imageRepository.shooter, this.x, this.y);
	};



	this.shoot = function() {

		var enemyStartX = game.shooter.x,
			enemyStartY = game.shooter.y;


		if (enemyballPoolonScreen < this.enemyballPool) {

			var thisEnemy = game.pool.CreateObj(1);
			thisEnemy.init(enemyStartX, enemyStartY, imageRepository.enemyball.width, imageRepository.enemyball.height);

			enemyballPoolonScreen++;

		}
		console.log('no. of enemyball on screen = ' +enemyballPoolonScreen);

	}

}
Shooter.prototype = new Rectangle();

/**
 * Ball class
 */
 
 function Ball() {

 	this.radius = 0;
 	this.centerX = 0;
 	this.centerY = 0;
 	this.direction = 0;
 	this.mass = 10;

 	this.speed = 2;
    this.speedX = this.speed;
    this.speedY = this.speed;

 }
 Ball.prototype = new Drawable();

/**
 * Create the Main Ball object that the player controls. The Main Ball is
 * drawn on the "main" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Mainball() {
 	

    this.leftEdge = 0;
    this.rightEdge = this.canvasWidth;
    this.topEdge = 0;
    this.bottomEdge = this.canvasHeight;

    /******************** added by beeb **************/
    this.ballRegion = null;
    this.ballMovingDown = false;
    this.ballMovingRight = false;
	/******************** added by beeb **************/

	this.collidedwithleftEdge = null;
	this.collidedwithrightEdge = null;
	
    	//Move the main ball
	this.draw = function() {

		this.collidedwithleftEdge = false;
		this.collidedwithrightEdge = false;
		
		this.context.clearRect(this.x+1, this.y, this.width, this.height);

	    this.x += this.speedX;
	    this.y += this.speedY;
	    
	    // X Collision with the wall
	    if (this.x <= this.leftEdge) {       
	    	this.speedX = this.speed;
	    	this.collidedwithleftEdge = true;
	    }     
	    else if (this.x >= this.rightEdge - this.width) {
	      	this.speedX = -this.speed;
	    	this.collidedwithrightEdge = true;
	    }

	    // Y Collision
	    if (this.y >= this.bottomEdge - this.height - 16) {

	    	// if hits paddle
	    	if (this.x + 25 > game.paddle.x && this.x < game.paddle.x + 64)
	    		this.speedY = -this.speed; // reverse speed
	    	else
	    		this.speedY = -this.speed;
	    		// temporary hold
	    		//restartGame();
	    } else if (this.y <= this.topEdge) { // if hit the top
	    	this.speedY = this.speed;
	    }

		this.context.drawImage(imageRepository.mainball, this.x, this.y);

		console.log('collide with right: ' +this.collidedwithrightEdge);
		console.log('collide with left: ' +this.collidedwithleftEdge);
	};
	

}
Mainball.prototype = new Ball();


function Enemyball() {
	
    this.leftEdge = 0;
    this.rightEdge = this.canvasWidth;
    this.topEdge = 0;
    this.bottomEdge = this.canvasHeight;

	//Move the main ball
	this.draw = function() {
		
		this.context.clearRect(this.x-1, this.y, this.width+1, this.height);

	    this.x += this.speedX;
	    this.y += this.speedY;

	    
	    // X Collision
	    if (this.x <= this.leftEdge) {       
	    	this.speedX = this.speed;     
	    }     
	    else if (this.x >= this.rightEdge - this.width) {
	      this.speedX = -this.speed;
	    }


	    // Y Collision
	    if (this.y >= this.bottomEdge - this.height - 16) {

	    	// if hits paddle
	    	if (this.x + 25 > game.paddle.x && this.x < game.paddle.x + 64)
	    		this.speedY = -this.speed; // reverse speed
	    	else
	    		restartGame();
	    } else if (this.y <= this.topEdge) { // if hit the top
	    	this.speedY = this.speed;
	    }

		this.context.drawImage(imageRepository.enemyball, this.x, this.y);


	};

}
Enemyball.prototype = new Ball();
