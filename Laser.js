define( ["juego/Entity", "juego/AnimationRunner", "ANIM"], function( Entity, AnimationRunner, ANIM ) {

var Laser = function( params ) {
	Entity.call( this );

	this.p1 = new Vec2();
	this.p2 = new Vec2();

	this.growRate = 1.0;
	this.decayRate = -0.1;
	this.decay = false;

	this.width = 1;

	this.shape = Entity.SHAPE.line;
	this.color = "red";

	this.setValues( params );

	this.mainRunner = new AnimationRunner( 0, 0, false, false );
	this.mainRunner.setLoopingAnim( ANIM.blueLaserSpin );
}

Laser.prototype = new Entity();
Laser.prototype.constructor = Laser;

Laser.prototype.hitWith = function( otherEntity ) {

}

Laser.prototype.update = function() {
	if ( this.decay ) {
		this.width += this.growRate;
		this.growRate += this.decayRate;
		if ( this.width <= 0 ) this.removeThis = true;
	}

	this.mainRunner.update( 0, 0, false, false );
}

Laser.prototype.draw = function( context ) {
	context.lineWidth = this.width;
	context.strokeStyle = this.color;

	var las = this;

	var line = function() {
		context.beginPath();
		context.moveTo( las.p1.x, las.p1.y );
		context.lineTo( las.p2.x, las.p2.y );
		context.stroke();	
	}

	context.globalAlpha = 0.1;
	context.lineWidth = this.width * 8;
	line();
	context.globalAlpha = 0.4;
	context.lineWidth = this.width * 4;
	line();
	context.globalAlpha = 0.75;
	context.lineWidth = this.width * 2;
	line();
	context.globalAlpha = 1.0;
	context.lineWidth = this.width;
	line();
}

return Laser;

});