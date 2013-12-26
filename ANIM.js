define( ["juego/Animation", "IMAGE"], function( Animation, IMAGE ) {

var ANIM = {

	// Here are the args for Animation for temporary convenience
	// Animation( name, image, whichFrames, timePerFrame )

	// Player
	playerForwardStill: new Animation( "Player forward still", IMAGE.playerForwardStill, [0], 2 ),
	playerForwardWalk: new Animation( "Player forward walk", IMAGE.playerForwardWalk, [0, 1], 2 ),

	// Blue Laser
	blueLaserSpin: new Animation( "Laser animation", IMAGE.blueLaser, [7, 5, 3, 1], 1),
	
	// Enemies
	turret: new Animation( "Turret", IMAGE.turret, [0], 1 ),
	
	// Effects
	explosion: new Animation( "Explosion", IMAGE.explosion, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 2 ),
};

return ANIM;

});