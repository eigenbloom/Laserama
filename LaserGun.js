var LaserGun = function( params ) {
	Entity.call( this );

	this.propogated = false;

	this.p1 = new Vec2();
	this.p2 = new Vec2();

	this.color = "orange";
	this.hasPower = false;

	this.points = [];

	this.lasers = [];

	this.setValues( params );
}

LaserGun.prototype = new Entity();
LaserGun.prototype.constructor = LaserGun;

LaserGun.prototype.hitWith = function( otherEntity ) {

}

LaserGun.prototype.update = function() {
	for ( var l in this.lasers ) {
		if ( this.lasers[l].removeThis ) this.lasers.splice( l, 1 );
	}
}

LaserGun.prototype.propagate = function( points ) {
	this.points = points;
}

LaserGun.prototype.fire = function() {
	// If the player has not picked up the battery yet, don't fire!
	if ( !this.hasPower ) {
		return false;
	}

	SOUND.laser.play();
	if ( this.points.length > 1 ) {
		// Group the points by twos into vectors 
		for ( var i = 0; i < this.points.length - 1; i++ ) {
			var l = new Laser( { p1: this.points[i], p2: this.points[i + 1], decay: true } );
			this.lasers.push( l );
			this.spawnEntity( l );
		}
	}
	// Expend the battery juice (should have gone with Energizer)
	this.hasPower = false;

	return true;
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