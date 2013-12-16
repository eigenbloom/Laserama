var LaserGun = function( params ) {
	Entity.call( this );

	this.propogated = false;

	this.p1 = new Vec2();
	this.p2 = new Vec2();

	this.color = "orange";

	this.points = [];

	this.setValues( params );
}

LaserGun.prototype = new Entity();
LaserGun.prototype.constructor = LaserGun;

LaserGun.prototype.hitWith = function( otherEntity ) {

}

LaserGun.prototype.update = function() {

}

LaserGun.prototype.propagate = function( points ) {
	this.points = points;
}

LaserGun.prototype.fire = function() {
	if ( this.points.length > 1 ) {
		// Group the points by twos into vectors 
		for ( var i = 0; i < this.points.length - 1; i++ ) {
			this.spawnEntity( new Laser( { p1: this.points[i], p2: this.points[i + 1] } ) );
		}
	}
}

LaserGun.prototype.draw = function( context ) {
	context.lineWidth = 2;
	context.strokeStyle = "red";

	context.beginPath();
	context.moveTo( this.p1.x, this.p1.y );
	context.lineTo( this.p2.x, this.p2.y );
	context.stroke();

	if ( this.points.length >= 2 ) {
		context.strokeStyle = this.color;
		context.beginPath();
		context.moveTo( this.points[0].x, this.points[0].y );

		for ( var i = 1; i < this.points.length; i++ ) {
			context.lineTo( this.points[i].x, this.points[i].y );
		}

		context.stroke();
	}
}