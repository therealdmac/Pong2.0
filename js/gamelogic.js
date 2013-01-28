
function collisionDetection() {
	
	//console.log(game.mainball.x);

	var x1 = game.mainball.x;
	var x2 = game.mainball2.x;
	var y1 = game.mainball.y;
	var y2 = game.mainball2.y;

	var distanceX = (x2 - x1)*(x2 - x1);
	var distanceY = (y2 - y1)*(y2 - y1);
	var distance = Math.sqrt(( distanceX + distanceY ));


	if(distance < 50) {
		
	}

	
	//console.log('distanceX is ' +distanceX);

	return false;
}



// newXVelocityOfBallOne
// newYVelocityOfBallOne
// newXVelocityOfBallTwo
// newYVelocityOfBallTwo




