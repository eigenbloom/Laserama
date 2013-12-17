var gravity = 0.5;

var Player = function( params ) {
	Entity.call( this );

	this.width = 16;
	this.height = 16;

	this.velX = 0.0;
	this.velY = 0.0;
	this.velZ = 0.0;
	this.posZ = 0.0;
	
	this.speed = 4.0;

	this.faceDir = DIR.down;

	this.collisionGroup = GROUP.player;

	this.gun = new LaserGun();
	this.spawnEntity( this.gun );

	this.setValues( params );

	this.animationRunner = new AnimationRunner(this.posX, this.posY, 0, 0);
	this.animationRunner.setLoopingAnim(ANIM.playerForwardStill);
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.STATE = {
	none: 0,
	grab: 1,
}

Player.prototype.hitWith = function( otherEntity ) {
	if ( otherEntity instanceof Laser && this.posZ == 0 ) {
		this.removeThis = true;
		this.gun.removeThis = true;
	}
	else if (otherEntity instanceof Battery ) {
		this.gun.hasPower = true;
		otherEntity.removeThis = true;
	}
}

Player.prototype.update = function( level ) {
	this.posZ += this.velZ;
	if ( this.posZ < 0.0 ) this.velZ += gravity;
	else this.posZ = 0.0;

	this.velX = 0;
	this.velY = 0;
	
	if ( keyHeld( KEY.A ) ) {
		this.faceDir = DIR.left;
		this.velX = -this.speed;
	}
	if ( keyHeld( KEY.D ) ) {
		this.faceDir = DIR.right;
		this.velX = this.speed;
	}
	if ( keyHeld( KEY.W ) ) {
		this.faceDir = DIR.up;
		this.velY = -this.speed;
	}
	if ( keyHeld( KEY.S ) ) {
		this.faceDir = DIR.down;
		this.velY = this.speed;
	}
	if ( keyHit( KEY.SPACE ) && this.posZ == 0 ) {
		this.velZ = -3;
	}

	if ( mouseHit() ) this.gun.fire();

	this.gun.p1.setValues( this.posX + this.width / 2, this.posY + this.height / 2 );
	this.gun.p2.set( mouse.pos );

	this.state = this.STATE.none;
	if ( keyHeld( KEY.X ) ) {
		this.state = this.STATE.grab;
	}
	
	if ( this.state == this.STATE.grab ) {

	}
	
	if ( this.collideLeft && this.velX < 0 ) this.velX = 0;
	if ( this.collideRight && this.velX > 0 ) this.velX = 0;
	if ( this.collideUp && this.velY < 0 ) this.velY = 0;
	if ( this.collideDown && this.velY > 0 ) this.velY = 0;
	
	this.posX += this.velX;
	this.posY += this.velY;
	
	this.animationRunner.update(this.posX, this.posY + this.posZ, 0, 0);
}

Player.prototype.draw = function( context ) {
		this.animationRunner.draw(context);
}