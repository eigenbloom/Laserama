define( ["juego/Entity", "IMAGE"], function( Entity, IMAGE ) {

var Battery = function( params ) {
	Entity.call( this );

	this.width = 12;
	this.height = 20;

	this.setValues( params );
}

Battery.prototype = new Entity();
Battery.prototype.constructor = Battery;

Battery.prototype.update = function( level ) {
	// The battery just has to sit there and look pretty
	return;
}

Battery.prototype.draw = function( context ) {
	IMAGE.battery.draw(context, this.posX, this.posY, 1);
}

return Battery;

});