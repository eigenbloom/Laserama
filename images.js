var IMAGE = {
	
	// Here are the arguments for AnimatedImage and RegularImage for temporary convenience
	// AnimatedImage(filename, frameWidth, frameHeight, hGap, vGap)
	// RegularImage(filename)

	// Items
	battery: new RegularImage( "./img/battery.png" ),

	// Enemies
	turretBase: new RegularImage( "./img/turretBase.png" ),
	turret: new RegularImage( "./img/turret.png" ),

	// Player
	playerForwardStill: new AnimatedImage( "./img/playerForwardStill.png", 20, 20, 0, 0),
	playerForwardWalk: new AnimatedImage( "./img/playerForwardWalk.png", 20, 20, 0, 0),
	
	// Effects
	explosion: new AnimatedImage( "./img/explosion.png", 20, 20, 0, 0),

	nextButton: new RegularImage( "img/next.png" ),
	againButton: new RegularImage( "img/again.png" ),	
};

var ANIM = {

	// Here are the args for Animation for temporary convenience
	// Animation( name, image, whichFrames, timePerFrame )

	// Player
	playerForwardStill: new Animation( "Player forward still", IMAGE.playerForwardStill, [0], 2 ),
	playerForwardWalk: new Animation( "Player forward walk", IMAGE.playerForwardWalk, [0, 1], 2 ),
	
	// Effects
	explosion: new Animation( "Explosion", IMAGE.explosion, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 2 ),
};