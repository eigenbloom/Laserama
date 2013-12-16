var Laser = function( params ) {
	Entity.call( this );

	this.p1 = new Vec2();
	this.p2 = new Vec2();

	this.growRate = 1.0;
	this.decayRate = -0.1;
	this.decay = false;

	this.width = 2;

	this.shape = SHAPE.line;
	this.color = "red";

	this.setValues( params );
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
}

Laser.prototype.draw = function( context ) {
	context.lineWidth = this.width;
	context.strokeStyle = this.color;

	context.beginPath();
	context.moveTo( this.p1.x, this.p1.y );
	context.lineTo( this.p2.x, this.p2.y );
	context.stroke();	
}