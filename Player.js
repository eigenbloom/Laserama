var gravity = 0.5;

var Player = function( params ) {
	Entity.call( this );

	this.width = 20;
	this.height = 20;

	this.velZ = 0.0;
	this.posZ = 0.0;

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

	if ( keyHit( KEY.A ) ) {
		this.faceDir = DIR.left;
		if ( !this.collideLeft ) this.posX -= 16;
	}
	if ( keyHit( KEY.D ) ) {
		this.faceDir = DIR.right;
		if ( !this.collideRight ) this.posX += 16;
	}
	if ( keyHit( KEY.W ) ) {
		this.faceDir = DIR.up;
		if ( !this.collideUp ) this.posY -= 16;
	}
	if ( keyHit( KEY.S ) ) {
		this.faceDir = DIR.down;
		if ( !this.collideDown ) this.posY += 16; 
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
}

Player.prototype.draw = function( context ) {
	context.fillStyle = "green";
	context.save();
	context.translate( 0, this.posZ );

	this.drawRect( context );

	this.drawCollisionBox( context );
	context.restore();

	this.animationRunner.update(this.posX, this.posY, 0, 0);
}

Player.prototype.draw = function( context ) {	
	this.animationRunner.draw(context);
}