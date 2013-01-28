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

/**
 * Ball class
 */
 
 function Ball() {
	
	// information: radius, center coordinates (x and y), direction (pending)
 }
 
// Rectangle class
 function Rectangle() {
 // information: width, height
 //paddle and wall will inherit from rectangle
 }
 
 /**
 * Wall class
 */
 
 function Wall() {
	
	// XXXX
 }
 
  /**
 * Object Pool class
 */
 
 function ObjectPool() {
	
	this.radius = r
 }

/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
function Background() {
	this.speed = 1; // Redefine speed of the background for panning

	// Implement abstract function
	this.draw = function() {
		// Pan background
		//this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);

		// Draw another image at the top edge of the first image
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		// If the image scrolled off the screen, reset
		if (this.y >= this.canvasHeight)
			this.y = 0;
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

	this.speed = 5;
	var counter = 0;

	this.draw = function() {
		this.context.drawImage(imageRepository.paddle, this.x, this.y);
	};

	this.move = function() {	

		counter++;

		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right) {
			// The ship moved, so erase it's current image so it can
			// be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);

			// Update x and y according to the direction to move and
			// redraw the ship. Change the else if's to if statements
			// to have diagonal movement.
			if (KEY_STATUS.left) {

				this.x -= this.speed;
				if (this.x <= 0) // Keep player within the screen
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
Paddle.prototype = new Drawable();



/**
 * Create the Main Ball object that the player controls. The Main Ball is
 * drawn on the "main" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Mainball() {



	this.speed = 2;
    this.speedX = this.speed;
    this.speedY = this.speed;
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

		this.context.drawImage(imageRepository.mainball, this.x, this.y);
	};

}
Mainball.prototype = new Drawable();