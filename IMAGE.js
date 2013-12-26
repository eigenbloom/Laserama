define( ["juego/RegularImage", "juego/AnimatedImage"], function( RegularImage, AnimatedImage ) {

var IMAGE = {
	
	// Here are the arguments for AnimatedImage and RegularImage for temporary convenience
	// AnimatedImage(filename, frameWidth, frameHeight, hGap, vGap)
	// RegularImage(filename)

	// Items
	battery: new RegularImage( "./img/battery.png" ),

	// Enemies
	turretBase: new RegularImage( "./img/turretBase.png" ),
	turret: new AnimatedImage( "./img/turret.png", 20, 20, 0, 0 ),

	// Player
	playerForwardStill: new AnimatedImage( "./img/playerForwardStill.png", 20, 20, 0, 0),
	playerForwardWalk: new AnimatedImage( "./img/playerForwardWalk.png", 20, 20, 0, 0),
	
	// Blue Laser
	blueLaser: new AnimatedImage( "./img/laser.png", 32, 16, 0, 0),

	// Effects
	explosion: new AnimatedImage( "./img/explosion.png", 20, 20, 0, 0),

	nextButton: new RegularImage( "img/next.png" ),
	againButton: new RegularImage( "img/again.png" ),	
};

return IMAGE;

});