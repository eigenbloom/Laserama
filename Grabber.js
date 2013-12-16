var Grabber = function( params ) {
	Region.call( this );

	this.target = null;

	this.inRange = [];

	this.objects = [];

	this.setValues( params );
}

Grabber.prototype = new Region();
Grabber.prototype.constructor = Grabber;

Grabber.prototype.clearCollisionData = function() {
	this.inRange = [];
}

Grabber.prototype.hitWith = function( otherEntity ) {
	if ( otherEntity instanceof Turret ) {
		this.inRange.push( otherEntity );
	}
}

Grabber.prototype.grab = function() {
	this.objects = this.inRange;

	//for ( o in this.objects ) {
	//	this.objects.removeThis = true;
	//}

	this.inRange = [];
}

Grabber.prototype.drop = function() {
	this.objects = [];
}

Grabber.prototype.update = function() {
	console.log( this.inRange.length );
}

Grabber.prototype.draw = function( context ) {
	context.fillStyle = "red";
	this.drawRect( context );
}