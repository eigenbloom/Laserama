var main;

var canvas, context; // Drawing modules

// Happens once everything is loaded
$(window).load( function() {
	canvas = document.getElementById( "screen" );
	context = canvas.getContext( "2d" );
	setInterval( update, 60 );
} );

var levelDir = "./lvl/";
var levelPrefix = "level";
var levels = ["1", "2", "3", "4", "5", "6", "7"];
var levelIndex = 0;

var SCREENS = {
	title: 0,
	loading: 1,
	level: 2,
}

var session = {
	screen: SCREENS.title,
	level: null,
	em: null,
	sm: null,
	scrollbox: null,
	loadLevel: function( name ) {
		session.screen = SCREENS.loading;

		session.level = new Level();
		session.level.loadFromTiledJSON( name, function() {

			session.em = new EntityManager();

			session.em.addSpawn( 1, function( x, y ) {
				return new Player( { posX: x, posY: y } );
			});

			session.em.addSpawn( 2, function( x, y ) {
				return new Turret( { posX: x, posY: y } );
			});
			
			session.em.addSpawn( 12, function( x, y) {
				return new Battery( {posX: x, posY: y} );
			});

			session.scrollbox = new ScrollBox( { 
				hTiles: session.level.width, vTiles: session.level.height,
				tileW: session.level.tileWidth, tileH: session.level.tileHeight,
				viewportW: canvas.width, viewportH: canvas.height } );

			session.screen = SCREENS.level;

			console.log( session.level.spawnLayer );
		} );
	},

	enemiesDead: function() {
		if ( session.em === undefined || session.em == null ) return false;

		for ( e in session.em.entities ) {
			if ( session.em.entities[e] instanceof Turret ) return false;
		}

		return true;
	},

	playerAlive: function() {
		if ( session.em === undefined || session.em == null ) return false;

		for ( e in session.em.entities ) {
			if ( session.em.entities[e] instanceof Player ) return true;
		}

		return false;
	},
}

// Main game loop
function update() {
	// Logic
	switch ( session.screen ) {
		case SCREENS.title:
			session.loadLevel( levelDir + levelPrefix + levels[levelIndex] + ".json");	
			break;
		case SCREENS.loading:
		
			break;
		case SCREENS.level:
			session.em.collide( session.level );
			session.em.update( session.level );
			session.em.spawn( session.level );
			session.em.grab();
			session.em.cull();

			if ( !session.playerAlive() ) session.loadLevel( levelDir + levelPrefix + levels[levelIndex] + ".json");
			if ( false && session.enemiesDead() ) {
				levelIndex++;
				levelIndex %= levels.length;
				session.loadLevel( levelDir + levelPrefix + levels[levelIndex] + ".json");
			} 
			break;
	}

	// Drawing
	context.fillStyle = "white";
	context.fillRect( 0, 0, canvas.width, canvas.height );

	switch ( session.screen ) {
		case SCREENS.title:
		
			break;
		case SCREENS.loading:
		
			break;
		case SCREENS.level:
			level.drawForeground( context, session.scrollbox, 0 );
			session.em.draw( context );		
			break;
	}

	mouseStateUpdater( canvas );
	keyboardStateUpdater();
}
