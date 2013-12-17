var main;

var canvas, context; // Drawing modules

// Happens once everything is loaded
$(window).load( function() {
	canvas = document.getElementById( "screen" );
	context = canvas.getContext( "2d" );

	context.font = '32pt Disco';
	context.fillText( "", 0, 0 );

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

var startButton = new Button( IMAGE.nextButton, 180, 130, 117, 99, function() {
	session.loadLevel( levelDir + "/" + levels[0] + ".json");	
});

var nextButton = new Button( IMAGE.nextButton, 180, 130, 117, 99, function() {
	levelIndex++;
	levelIndex %= levels.length;
	session.loadLevel( levelDir + "/" + levels[levelIndex] + ".json");
});

var againButton = new Button( IMAGE.againButton, 180, 130, 117, 99, function() {
	session.loadLevel( levelDir + "/" + levels[levelIndex] + ".json");	
});

var banner = {
	font: "72pt Disco",
}

var drawBanner = function( text ) {
	context.fillStyle = "white";
	context.textAlign = "center";
	context.font = banner.font;
	context.fillText( text, canvas.width / 2, canvas.height / 2 );
}

// Main game loop
function update() {

	/*imageCanvas = document.getElementById( "images" );
	imageContext = imageCanvas.getContext( "2d" );	

	imageContext.fillStyle = "orange";
	imageContext.fillRect( 0, 0, imageCanvas.width, imageCanvas.height );

	var h = 0;

	for ( i in allimages ) {

		imageContext.drawImage( allimages[i], 0, h, allimages[i].width, allimages[i].height );

		h += allimages[i].height;

		if ( h > imageCanvas.height ) imageCanvas.height *= 2;
	}*/

	// Logic
	switch ( session.screen ) {
		case SCREENS.title:
			startButton.update();
			break;
		case SCREENS.loading:
		
			break;
		case SCREENS.level:
			session.em.collide( session.level );
			session.em.update( session.level );
			session.em.spawn( session.level );
			session.em.grab();
			session.em.cull();

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
			break;
	}

	// Drawing
	context.fillStyle = "white";
	context.fillRect( 0, 0, canvas.width, canvas.height );

	switch ( session.screen ) {
		case SCREENS.title:
			grayOverlay();
			drawBanner( "laserama" );
			startButton.draw( context );
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
			drawBanner( "groovy!" );			
			nextButton.draw( context );
			break;
		case SCREENS.lose:
			level.drawForeground( context, session.scrollbox, 0 );
			session.em.draw( context );				
			grayOverlay();
			drawBanner( "square..." );			
			againButton.draw( context );
			break;			
	}

	mouseStateUpdater( canvas );
	keyboardStateUpdater();
}

function grayOverlay() {
	context.globalAlpha = 0.5;
	context.fillStyle = "gray";
	context.fillRect( 0, 0, canvas.width, canvas.height );
	context.globalAlpha = 1.0;
}
