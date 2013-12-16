define([], function() {

var Session = function() {
	this.canvas = null;
	this.context = null;

	this.screen = this.SCREENS.title;
	this.level = null;
	this.em = null;
	this.sm = null;
	this.scrollbox = null;
}

Session.prototype.SCREENS = {
	title: 0,
	loading: 1,
	level: 2,
}

Session.prototype.loadLevel = function( name ) {
	this.screen = SCREENS.loading;

	this.level = new Level();
	this.level.loadFromTiledJSON( name, function() {

		this.screen = SCREENS.level;
		this.em = new EntityManager();

		this.em.addSpawn( 1, function( x, y ) {
			return new Player( { posX: x, posY: y } );
		});

		this.em.addSpawn( 2, function( x, y ) {
			return new Turret( { posX: x, posY: y } );
		});

		this.scrollbox = new ScrollBox( { 
			hTiles: this.level.width, vTiles: this.level.height,
			tileW: this.level.tileWidth, tileH: this.level.tileHeight,
			viewportW: canvas.width, viewportH: canvas.height } );
	} );
}

// Main game loop
Session.prototype.update = function() {
	
	// Logic
	switch ( this.screen ) {
		case SCREENS.title:
			this.loadLevel( "./lvl/1.json" );
			break;
		case SCREENS.loading:
		
			break;
		case SCREENS.level:
			this.em.spawn( this.level );
			break;
	}

	// Drawing
	this.context.fillStyle = "white";
	this.context.fillRect( 0, 0, canvas.width, canvas.height );

	switch ( this.screen ) {
		case SCREENS.title:
		
			break;
		case SCREENS.loading:
		
			break;
		case SCREENS.level:
			level.drawForeground( context, this.scrollbox, 0 );
			this.em.draw( context );		

			var points = level.bouncecast( mouse.line );

			this.context.lineWidth = 2;
			this.context.strokeStyle = "red";
			this.context.beginPath();

			if ( points.length >= 2 ) {
				this.context.moveTo( points[0].x, points[0].y );
				for ( var i = 1; i < points.length; i++ ) {
					this.context.lineTo( points[i].x, points[i].y );
				}
			}
			this.context.stroke();

			break;
	}

	mouseStateUpdater( canvas );
	keyboardStateUpdater();
}

});