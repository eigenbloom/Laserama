var Laser = function( params ) {
	Entity.call( this );

	this.p1 = new Vec2();
	this.p2 = new Vec2();

	this.shape = SHAPE.line;
	this.color = "red";

	this.setValues( params );
}

Laser.prototype = new Entity();
Laser.prototype.constructor = Laser;

Laser.prototype.hitWith = function( otherEntity ) {

}

Laser.prototype.update = function() {

}

Laser.prototype.draw = function( context ) {
	context.lineWidth = 2;
	context.strokeStyle = this.color;

	context.beginPath();
	context.moveTo( this.p1.x, this.p1.y );
	context.lineTo( this.p2.x, this.p2.y );
	context.stroke();	
}