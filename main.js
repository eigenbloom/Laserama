var main;

var canvas, context; // Drawing modules

// Happens once everything is loaded
$(window).load( function() {
	canvas = document.getElementById( "screen" );
	context = canvas.getContext( "2d" );
<<<<<<< HEAD
=======
	
	context.font = '32pt Disco';
	context.fillText( "", 0, 0 );

>>>>>>> graham
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
	win: 3,
	lose: 4,
}

var STATUS = { 
	inprogress: 0,
	won: 1, 
	lost: 2,
}

var session = {
	screen: SCREENS.title,
	levelState: STATUS.inprogress,
	level: null,
	em: null,
	sm: null,
	scrollbox: null,
	timer: 0,
	loadLevel: function( name ) {
		session.screen = SCREENS.loading;

		session.level = new lrLevel();
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
			session.levelState = STATUS.inprogress,

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

var nextImg = new RegularImage( "img/next.png" );
var againImg = new RegularImage( "img/again.png" );

var nextButton = new Button( "next", 190, 100, 100, 50, function() {
	levelIndex++;
	levelIndex %= levels.length;
	session.loadLevel( levelDir + "/" + levels[levelIndex] + ".json");
});

var againButton = new Button( "again", 190, 100, 100, 50, function() {
	session.loadLevel( levelDir + "/" + levels[levelIndex] + ".json");	
});


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

<<<<<<< HEAD
			if ( !session.playerAlive() ) session.loadLevel( levelDir + levelPrefix + levels[levelIndex] + ".json");
			if ( false && session.enemiesDead() ) {
				levelIndex++;
				levelIndex %= levels.length;
				session.loadLevel( levelDir + levelPrefix + levels[levelIndex] + ".json");
			} 
=======
			switch ( session.levelState ) {
				case STATUS.inprogress:
					if ( !session.playerAlive() ) {
						session.levelState = STATUS.lost;
						session.timer = 20;
					}
					if ( session.enemiesDead() ) {
						session.levelState = STATUS.won;
						session.timer = 20;
					} 
					break;
				case STATUS.won:
					session.timer--;
					if ( session.timer <= 0 ) {
						session.screen = SCREENS.win;
					}
					break;
				case STATUS.lost:
					session.timer--;
					if ( session.timer <= 0 ) {
						session.screen = SCREENS.lose;						
					}
					break;
			}
			break;
		case SCREENS.win:
			nextButton.update();
			break;
		case SCREENS.lose:
			againButton.update();
>>>>>>> graham
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
		case SCREENS.win:
			level.drawForeground( context, session.scrollbox, 0 );
			session.em.draw( context );				
			grayOverlay();
			nextButton.draw( context );
			break;
		case SCREENS.lose:
			level.drawForeground( context, session.scrollbox, 0 );
			session.em.draw( context );				
			grayOverlay();
			againButton.draw( context );
			break;			
	}

	mouseStateUpdater( canvas );
	keyboardStateUpdater();
}

function grayOverlay() {
	context.globalAlpha = 0.5;
	context.fillStyle = "black";
	context.fillRect( 0, 0, canvas.width, canvas.height );
	context.globalAlpha = 1.0;
}
