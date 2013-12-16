var Player = function( params ) {
	Entity.call( this );

	this.width = 16;
	this.height = 16;

	this.collisionGroup = GROUP.player;

	this.gun = new LaserGun();

	this.spawnEntity( this.gun );

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
}

Player.prototype.draw = function( context ) {
	context.fillStyle = "green";
	this.drawRect( context );

	this.drawCollisionBox( context );

	this.gun.draw( context );
}