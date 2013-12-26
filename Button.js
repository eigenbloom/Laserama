define( ["juego/mouse"], function( mouse ) {

var Button = function( img, posX, posY, width, height, onRelease ) {
	this.img = img;
	this.posX = posX;
	this.posY = posY;
	this.width = width;
	this.height = height;
	this.onRelease = onRelease;

	this.hover = false;
	this.clicked = false;
}

Button.prototype.update = function() {
	this.hover = false;
	this.clicked = false;

	if ( mouse.pos.x >= this.posX && mouse.pos.x <= this.posX + this.width ) {
		if ( mouse.pos.y >= this.posY && mouse.pos.y <= this.posY + this.height ) {
			this.hover = true;

			if ( mouse.held() ) this.clicked = true;
			if ( mouse.letGo() ) this.onRelease();
		}
	}
}

Button.prototype.draw = function( context ) {
	context.fillStyle = "black";
	context.save();

	if ( this.hover && !this.clicked ) context.translate( -3, -3 );

	this.img.draw( context, this.posX, this.posY, 1.0 );

	context.restore();

	this.hover = false;
	this.clicked = false;	
}

return Button;

});