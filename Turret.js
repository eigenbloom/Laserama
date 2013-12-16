var Turret = function( params ) {
	Entity.call( this );

	this.width = 16;
	this.height = 16;

	this.collisionGroup = GROUP.enemy;

	this.angle = 0.0;
	this.rotateSpeed = 0.1;

	this.hit = false;

	this.laser = new Laser( { color: "blue" } );
	this.spawnEntity( this.laser );

	this.setValues( params );
}

Turret.prototype = new Entity();
Turret.prototype.constructor = Turret;

Turret.prototype.hitWith = function( otherEntity ) {
	if ( otherEntity instanceof Laser ) {
		this.removeThis = true;
		this.laser.removeThis = true;
	}
}

Turret.prototype.update = function( level ) {
	this.angle += this.rotateSpeed;

	this.laser.p1.setValues( this.posX + this.width / 2, this.posY + this.height / 2 );
	this.laser.p2.setValues( this.laser.p1.x + this.width / 2 + Math.cos( this.angle ) * 100, this.laser.p1.y + Math.sin( this.angle ) * 100 );

	var line = new Line();
	
	line.p1.set( this.laser.p1 );
	line.p2.set( this.laser.p2 );

	var points = level.bouncecast( line, 1 );

	this.laser.p1.set( points[0] );
	this.laser.p2.set( points[1] );
}

Turret.prototype.draw = function( context ) {
	context.fillStyle = "blue";
	this.drawRect( context );
}