var Player = function( params ) {
	Entity.call( this );

	this.width = 20;
	this.height = 20;

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
	if ( otherEntity instanceof Laser ) {
		this.removeThis = true;
		this.gun.removeThis = true;
	}
	else if (otherEntity instanceof Battery ) {
		this.gun.hasPower = true;
		otherEntity.removeThis = true;
	}
}

Player.prototype.update = function() {
	if ( !this.collideLeft && keyHit( KEY.LEFT ) ) this.posX -= 16;
	if ( !this.collideRight && keyHit( KEY.RIGHT ) ) this.posX += 16;
	if ( !this.collideUp && keyHit( KEY.UP ) ) this.posY -= 16;
	if ( !this.collideDown && keyHit( KEY.DOWN ) ) this.posY += 16;

	if ( keyHit( KEY.Z ) ) this.gun.fire();

	this.gun.p1.setValues( this.posX + this.width / 2, this.posY + this.height / 2 );
	this.gun.p2.set( mouse.pos );

	this.state = this.STATE.none;
	if ( keyHeld( KEY.X ) ) {
		this.state = this.STATE.grab;
	}
	
	if ( this.state == this.STATE.grab ) {

	}

	this.animationRunner.update(this.posX, this.posY, 0, 0);
}

Player.prototype.draw = function( context ) {	
	this.animationRunner.draw(context);
}