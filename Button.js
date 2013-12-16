var Button = function( text, posX, posY, width, height, onClick ) {
	this.text = text;
	this.posX = posX;
	this.posY = posY;
	this.width = width;
	this.height = height;
	this.onClick = onClick;

	this.hover = false;
	this.clicked = false;
}

Button.prototype.update = function() {
	this.hover = false;
	this.clicked = false;

	if ( mouse.pos.x >= this.posX && mouse.pos.x <= this.posX + this.width ) {
		if ( mouse.pos.y >= this.posY && mouse.pos.y <= this.posY + this.height ) {
			this.hover = true;

			if ( mouseHit() ) this.onClick();
			if ( mouseHeld() ) this.clicked = true;
		}
	}
}

Button.prototype.draw = function( context ) {
	context.fillStyle = "black";
	context.save();

	if ( this.hover && !this.clicked ) context.translate( -5, -5 );

	context.fillRect( this.posX, this.posY, this.width, this.height );

	context.font = "18pt Disco"
	context.textAlign = "center";
	context.textBaseline = "top";

	context.fillStyle = "white";
	context.fillText( this.text, this.posX + this.width / 2, this.posY )

	//this.text.draw( context, this.posX, this.posY, 2.0 );

	context.restore();
}