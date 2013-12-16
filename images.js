var IMAGE = {
	
	// Here are the arguments for AnimatedImage and RegularImage for temporary convenience
	// AnimatedImage(filename, frameWidth, frameHeight, hGap, vGap)
	// RegularImage(filename)

	// Items
	battery: new RegularImage( "./img/battery.png" ),

	// Enemies
	turretBase: new RegularImage( "./img/turretBase" ),
	turret: new RegularImage( "./img/turret" ),

	// Player
	playerForwardStill: new RegularImage( "./img/playerForwardStill.png", 20, 20, 0, 0),
	playerForwardWalk: new AnimatedImage( "./img/playerForwardWalk.png", 20, 20, 0, 0),
	
	// Effects
	explosion: new AnimatedImage( "./img/explosion.png", 20, 20, 0, 0),
	
};

var ANIM = {

	// Here are the args for Animation for temporary convenience
	// Animation( name, image, whichFrames, timePerFrame )

	// Player
	playerForwardWalk: new Animation( "Player forward walk", IMAGE.playerForward, [0] ),
	
	// Effects
	explosion: new AnimatedImage( "Explosion", IMAGE.explosion, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] ),
};