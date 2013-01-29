
function collisionDetection() {
	
	//console.log(game.mainball.x);

	var x1 = game.mainball.x;
	var y1 = game.mainball.y;

	var x2 = game.mainball2.x;
	var y2 = game.mainball2.y;

	var x3 = game.enemyball.x;	
	var y3 = game.enemyball.y;

	// Distance 1
	var distance1X = (x2 - x1)*(x2 - x1);
	var distance1Y = (y2 - y1)*(y2 - y1);
	var distance1 = Math.sqrt(( distance1X + distance1Y ));

	// Distance 2
	var distance2X = (x3 - x1)*(x3 - x1);
	var distance2Y = (y3 - y1)*(y3 - y1);
	var distance2 = Math.sqrt(( distance2X + distance2Y ));

	// Distance 3
	var distance3X = (x3 - x2)*(x3 - x2);
	var distance3Y = (y3 - y2)*(y3 - y2);
	var distance3 = Math.sqrt(( distance3X + distance3Y ));

	console.log('distance1 is ' +distance1);
	console.log('distance2 is ' +distance2);
	console.log('distance3 is ' +distance3);

	

	if( ( distance2 ) < 50) {
		//physicsEngine(game.mainball, game.mainball2);
		physicsEngine(game.mainball, game.enemyball);
		//physicsEngine(game.mainball2, game.enemyball);

	}

	if( ( distance1 ) < 50) {
		physicsEngine(game.mainball, game.mainball2)

	}

	if( ( distance3 ) < 50) {
		physicsEngine(game.mainball2, game.enemyball);

	}

	

	return false;
}



// newXVelocityOfBallOne
// newYVelocityOfBallOne
// newXVelocityOfBallTwo
// newYVelocityOfBallTwo




