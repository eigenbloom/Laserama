define( ["juego/Entity", "juego/AnimationRunner", "juego/Line", "Laser", "ANIM", "IMAGE"], function( Entity, AnimationRunner, Line, Laser, ANIM, IMAGE ) {

var Turret = function( params ) {
	Entity.call( this );

	this.width = 20;
	this.height = 20;

	this.collisionGroup = Entity.GROUP.enemy;

	this.angle = 0.0;
	this.rotateSpeed = 0.0;

	this.hit = false;
	this.speed = 3;

	this.laser = new Laser( { color: "blue" } );
	this.spawnEntity( this.laser );

	this.setValues( params );
	this.animationRunner = new AnimationRunner(this.posX, this.posY, 0, 0);
	this.animationRunner.setLoopingAnim(ANIM.turret);
}

Turret.prototype = new Entity();
Turret.prototype.constructor = Turret;

Turret.prototype.hitWith = function( otherEntity ) {
	if ( otherEntity instanceof Laser ) {
		this.removeThis = true;
		this.laser.removeThis = true;
	}
}

Turret.prototype.onCollideLeft = function() {
	this.velX *= -1;
}

Turret.prototype.onCollideRight = function() {
	this.velX *= -1;
}

Turret.prototype.onCollideDown = function() {
	this.velY *= -1;
}

Turret.prototype.onCollideUp = function() {
	this.velY *= -1;
}

Turret.prototype.update = function( level ) {
	this.posX += this.velX;
	this.posY += this.velY;

	//this.velX = this.faceDir.X * this.speed;
	//this.velY = this.faceDir.Y * this.speed;

	//if ( this.collideRight && this.velX || this.collideLeft ) this.turnAround();
	//if ( this.collideUp || this.collideDown ) this.turnAround();

	this.angle += this.rotateSpeed;

	this.laser.p1.setValues( this.posX + this.width / 2, this.posY + this.height / 2 );
	this.laser.p2.setValues( this.laser.p1.x + this.width / 2 + Math.cos( this.angle ) * 1000, this.laser.p1.y + Math.sin( this.angle ) * 1000 );

	var line = new Line();
	
	line.p1.set( this.laser.p1 );
	line.p2.set( this.laser.p2 );

	var points = level.bouncecast( line, 1 );

	this.laser.p2.set( points[0] );
	this.laser.p2.set( points[1] );
	
	this.animationRunner.update(this.posX, this.posY, 0, 0);
	this.animationRunner.setRotation(this.angle - Math.PI / 2);
}

Turret.prototype.draw = function( context ) {
	IMAGE.turretBase.draw(context, this.posX, this.posY, 1);
	this.animationRunner.draw(context);
}

return Turret;

});