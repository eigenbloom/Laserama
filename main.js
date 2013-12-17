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
var levels = ["2", "1", "5", "6", "7", "8"];
var levelIndex = 0;

var SCREENS = {
	title: 0,
	loading: 1,
	level: 2,
	win: 3,
	lose: 4,
	done: 5,
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
				return new Player( { posX: x, posY: y } ); });

			// Non-rotating turret spawns
			session.em.addSpawn( 9, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: Math.PI / 2, rotateSpeed: 0} ); });
			session.em.addSpawn( 10, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: Math.PI, rotateSpeed: 0} ); });
			session.em.addSpawn( 20, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: 3* Math.PI / 2, rotateSpeed: 0} ); });
			session.em.addSpawn( 21, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: 0, rotateSpeed: 0} ); });
			
			// Clockwise rotating turret spawns
			session.em.addSpawn( 22, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: Math.PI / 2, rotateSpeed: 0.1} ); });
			session.em.addSpawn( 23, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: Math.PI, rotateSpeed: 0.1} ); });
			session.em.addSpawn( 33, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: 3* Math.PI / 2, rotateSpeed: 0.1} ); });
			session.em.addSpawn( 34, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: 0, rotateSpeed: 0.1} ); });
			
			// Counterclockwise rotating turret spawns
			session.em.addSpawn( 24, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: Math.PI / 2, rotateSpeed: -0.1} ); });
			session.em.addSpawn( 25, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: Math.PI, rotateSpeed: -0.1} ); });
			session.em.addSpawn( 35, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: 3* Math.PI / 2, rotateSpeed: -0.1} ); });
			session.em.addSpawn( 36, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: 0, rotateSpeed: -0.1} ); });

			// Left Strafe
			session.em.addSpawn( 27, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: -Math.PI / 2, velX: -2 } ); });
			// Right Strafe
			session.em.addSpawn( 38, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: -Math.PI / 2, velX: 2} ); });		
			// Up Strafe
			session.em.addSpawn( 37, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: 0, velY: -2 } ); });
			// Down Strafe
			session.em.addSpawn( 26, function( x, y ) {
				return new Turret( {posX: x, posY: y, angle: 0, velY: 2 } ); });			
			
			// Battery spawn
			session.em.addSpawn( 12, function( x, y) {
				return new Battery( {posX: x, posY: y} ); });

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

	playerFired: function() {
		if ( session.em === undefined || session.em == null ) return false;

		for ( e in session.em.entities ) {
			if ( session.em.entities[e] instanceof Player ) {
				return ( session.em.entities[e].hasFired && session.em.entities[e].gun.lasers.length == 0 )
			}
		}

		return false;
	},	
}

var startButton = new Button( IMAGE.nextButton, 180, 300, 117, 99, function() {
	session.loadLevel( levelDir + levelPrefix + levels[0] + ".json");	
	SOUND.song.loop();
});

var nextButton = new Button( IMAGE.nextButton, 180, 300, 117, 99, function() {
	levelIndex++;

	if ( levelIndex >= levels.length ) {
		session.screen = SCREENS.done;
		SOUND.song.pause();
		levelIndex %= levels.length;
	} else session.loadLevel( levelDir + levelPrefix + levels[levelIndex] + ".json");
});

var againButton = new Button( IMAGE.againButton, 180, 300, 117, 99, function() {
	session.loadLevel( levelDir + levelPrefix + levels[levelIndex] + ".json");	
});

var finishButton = new Button( IMAGE.againButton, 180, 300, 117, 99, function() {
	session.screen = SCREENS.title;	
}); 

var winMessages = [ "Groovy!", "Far Out!", "Ace!", "Dig it!" ];
var loseMessages = [ "Wasted!", "Not Cool!", "Ouch!", "Denied!" ];
var missMessages = [ "Miffed!", "Dang!", "Nope!" ];

var randomElement = function( array ) {
	return array[ Math.floor( Math.random() * array.length ) ];
}

var banner = {
	font: "72pt Disco",
	text: "",
}

var drawBanner = function() {
	context.fillStyle = "white";
	context.textAlign = "center";
	context.font = banner.font;
	context.fillText( banner.text, canvas.width / 2, canvas.height / 2 );
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
			banner.text = "laserama";
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
						SOUND.die.play();
						session.levelState = STATUS.lost;
						banner.text = randomElement( loseMessages );
						session.timer = 20;
					} else if ( session.enemiesDead() ) {
						session.levelState = STATUS.won;
						banner.text = randomElement( winMessages );
						session.timer = 20;
					} else if ( session.playerAlive() && session.playerFired() ) {
						session.levelState = STATUS.lost;
						banner.text = randomElement( missMessages );
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
		case SCREENS.done:
			banner.text = "You Win!";
			finishButton.update();
	}

	// Drawing
	context.fillStyle = "black";
	context.fillRect( 0, 0, canvas.width, canvas.height );

	switch ( session.screen ) {
		case SCREENS.title:
			grayOverlay();
			drawBanner();
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
			drawBanner();			
			nextButton.draw( context );
			break;
		case SCREENS.lose:
			level.drawForeground( context, session.scrollbox, 0 );
			session.em.draw( context );				
			grayOverlay();
			drawBanner();			
			againButton.draw( context );
			break;			
		case SCREENS.done:
			grayOverlay();
			drawBanner();
			finishButton.draw( context );
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
