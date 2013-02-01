
function collisionDetection() {
	
	//console.log(game.mainball.x);

	var x1 = game.mainball.x;
	var y1 = game.mainball.y;

	var x2 = game.mainball2.x;
	var y2 = game.mainball2.y;

	var x3 = game.enemyball.x;	
	var y3 = game.enemyball.y;

	// Distance 1 (between mainball and mainball2)
	var distance1X = (x2 - x1)*(x2 - x1);
	var distance1Y = (y2 - y1)*(y2 - y1);
	var distance1 = Math.sqrt(( distance1X + distance1Y ));

	// Distance 2 (between mainball and enemyball)
	var distance2X = (x3 - x1)*(x3 - x1);
	var distance2Y = (y3 - y1)*(y3 - y1);
	var distance2 = Math.sqrt(( distance2X + distance2Y ));

	// Distance 3 (between mainball2 and enemyball)
	var distance3X = (x3 - x2)*(x3 - x2);
	var distance3Y = (y3 - y2)*(y3 - y2);
	var distance3 = Math.sqrt(( distance3X + distance3Y ));

	

	if( ( distance2 ) < 50) {
		// run in parallel while animate is still running
		physicsEngine(game.mainball, game.enemyball);



	}

	if( ( distance1 ) < 50) {
		physicsEngine(game.mainball, game.mainball2)
	}

	if( ( distance3 ) < 50) {
		physicsEngine(game.mainball2, game.enemyball);
	}

	

	return false;
}


// enemyBall Shooter
function shooterTimer() {

}

// debug 

function debugTool() {

	document.getElementById("mbX").innerHTML=game.mainball.x; 
	document.getElementById("mbY").innerHTML=game.mainball.y; 
	document.getElementById("mbSx").innerHTML=game.mainball.speedX;
	document.getElementById("mbSy").innerHTML=game.mainball.speedY; 
	setTimeout("startTimer()", 1);

}


