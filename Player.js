var Player = function( params ) {
	Entity.call( this );

	this.width = 16;
	this.height = 16;

	this.faceDir = DIR.down;

	this.collisionGroup = GROUP.player;

	this.gun = new LaserGun();
	this.spawnEntity( this.gun );

	this.grabber = new Grabber();
	this.grabber.width = 16;
	this.grabber.height = 16;
	this.spawnEntity( this.grabber );

	this.setValues( params );
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.STATE = {
	none: 0,
	grab: 1,
}

Player.prototype.hitWith = function( otherEntity ) {
	if ( otherEntity instanceof Laser ) {
	//	this.removeThis = true;
	//	this.gun.removeThis = true;
	}
}

Player.prototype.update = function( level ) {
	if ( keyHit( KEY.LEFT ) ) {
		this.faceDir = DIR.left;
		if ( !this.collideLeft ) this.posX -= 16;
	}
	if ( keyHit( KEY.RIGHT ) ) {
		this.faceDir = DIR.right;
		if ( !this.collideRight ) this.posX += 16;
	}
	if ( keyHit( KEY.UP ) ) {
		this.faceDir = DIR.up;
		if ( !this.collideUp ) this.posY -= 16;
	}
	if ( keyHit( KEY.DOWN ) ) {
		this.faceDir = DIR.down;
		if ( !this.collideDown ) this.posY += 16; 
	}

	switch ( this.faceDir ) {
		case DIR.left:
			this.grabber.posX = this.posX - this.grabber.width;
			this.grabber.posY = this.posY;
			break;
		case DIR.right:
			this.grabber.posX = this.posX + this.width;
			this.grabber.posY = this.posY;
			break;
		case DIR.up:
			this.grabber.posX = this.posX;
			this.grabber.posY = this.posY - this.grabber.height;	
			break;
		case DIR.down:
			this.grabber.posX = this.posX;
			this.grabber.posY = this.posY + this.height;
			break;
	}

	if ( keyHit( KEY.X ) ) {
		this.grabber.grab();
	}

	if ( keyLetGo( KEY.X ) ) {
		this.grabber.drop();
	}

	for ( o in this.grabber.objects ) {
		var obj = this.grabber.objects[o];

		obj.posX = this.posX;
		obj.posY = this.posY;
	}

	if ( keyHit( KEY.Z ) ) this.gun.fire();

	this.gun.p1.setValues( this.posX + this.width / 2, this.posY + this.height / 2 );
	this.gun.p2.set( mouse.pos );

	this.state = this.STATE.none;
	if ( keyHeld( KEY.X ) ) {
		this.state = this.STATE.grab;
	}

	if ( this.state == this.STATE.grab ) {

	}
}

Player.prototype.draw = function( context ) {
	context.fillStyle = "green";
	this.drawRect( context );

	this.drawCollisionBox( context );

	this.gun.draw( context );
}