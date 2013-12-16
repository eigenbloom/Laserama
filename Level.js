///////////
// LEVEL //
///////////

/*
	Class that holds and maintains all of the data used for a level.
	This "data" amounts to:
		-the width and height of the level
		-several grids of tiles ("layers"):
			-drawing layers for visuals
			-a collision layer for interaction with the level
			-a spawn layer for specifying points where objects will be created
		-the tile size of the images used in the level
		-several scrolling backgrounds
		-an image to use for the draw layers
		
		loadFromTiledJSON() - Read level data from a JSON file written by the tile editor program Tiled
		getCollisionData() - Reads from the collision layer
		getSpawnData() - Reads from the spawn layer
		setSpawnData() - Writes to the spawn layer
		collide() - Tests an entity for collision against the collision layer and corrects overlap with solid regions
		draw() - Draws the background and visible layers of the level
		
		Usage:
			loadFromTiledJSON
				call once, before the level has started
			getCollisionData
				not necessary to call externally, but may be useful for predictive AI
			getSpawnData
			setSpawnData
				use when creating entities - call getSpawnData to find spawn points, and setSpawnData to clear them so they're only used once
			collide
				call once per entity per cycle
			draw
				call once per cycle 
*/

var LEVEL_DIR = "./lvl/";

var lrLevel = function() {
	Level.call( this );

	this.width = 0;
	this.height = 0;
	
	this.drawLayers = [];

	this.paths = [];
	
	this.collisionLayer = null;
	this.spawnLayer = null;
	
	this.tileWidth = 0;
	this.tileHeight = 0;

	this.image = null;
	this.collisionImage = null;
	this.spawnImage = null;

	this.frameCounter = 0;
}

lrLevel.prototype = new Level();
lrLevel.prototype.constructor = lrLevel();

///////////////////////
// LOADFROMTILEDJSON // Load a tilemap made with the map editor program Tiled
///////////////////////	
	
/*
 * levelFileName - name of the level file
 * callback - function to call when the level has finished loading
 */	

lrLevel.prototype.loadFromTiledJSON = function( levelFilename, callback ) {
	console.log( "[lrLevel] Attempting to load " + levelFilename + " as Tiled JSON" );

	var tileOffset = 0;
	
	level = this;
	
	$.ajax({
		type: "POST",
		url: "load.php",

		data: { filename: levelFilename },
		success: function( filedata ) {
			
			levelData = JSON.parse( filedata );			
			console.log( "[lrLevel] " + levelFilename);
			console.log( "[lrLevel] " + levelData );
			
			level.width = levelData.width;
			level.height = levelData.height;
			level.tileWidth = levelData.tilewidth;
			level.tileHeight = levelData.tileheight;
			
			for ( l in levelData.layers ) {
				var filelayer = levelData.layers[l];

				var isObjectLayer = ( filelayer.objects !== undefined );
				var isTileLayer = ( filelayer.data !== undefined );

				// Object layer, has spawns and paths
				if ( isObjectLayer ) {
					console.log( "[lrLevel] Object layer " + filelayer.name );
					
					for ( o in filelayer.objects ) {
						object = filelayer.objects[o];

						var isPath = ( object.polyline !== undefined );

						if ( isPath ) {
							var path = new Path();

							for ( n in object.polyline ) {
								var vertex = object.polyline[n];

								path.addNode( new Node( vertex.x + object.x, vertex.y + object.y ) );
							}

							level.paths.push( path );
						} else {

						}

						console.log( "[lrLevel] Object " + object.name );
					}
				} else if ( isTileLayer ) {
					var layer = new TileArray( filelayer.width, filelayer.data );
					
					if ( filelayer.name == "Collision" || filelayer.name == "collision" ) {
						level.collisionLayer = layer;
					} else if ( filelayer.name == "Spawn" || filelayer.name == "spawn" ) {
						level.spawnLayer = layer;
					} else {
						console.log( "[lrLevel] Layer " + filelayer.name );
						level.drawLayers.push( layer );
					}
				} else {
					console.log( "[Error] Layer " + filelayer.name + " in file " + levelFilename + " is neither an object nor tile layer" );
				}
			}

			for ( t in levelData.tilesets ) {
				tileset = levelData.tilesets[t];
				
				if ( tileset.name == "Collision" || tileset.name == "collision" ) {
					if ( level.collisionLayer != null ) {
						level.collisionLayer.map( function( r, c, val ) {
							var newVal = val - tileset.firstgid;
							if ( newVal < 0 ) newVal = 0;
						
							level.collisionLayer.set( r, c, newVal );
							if ( newVal > 0 ) level.shapes.push( new Shape().Rectangle( c * level.tileWidth, r * level.tileHeight, level.tileWidth, level.tileHeight ) );
						} ); 
					}					
				} else if ( tileset.name == "Spawn" || tileset.name == "spawn" ) {
					if ( level.spawnLayer != null ) {
						level.spawnLayer.map( function( r, c, val ) {
							var newVal = val - tileset.firstgid;
							if ( newVal < 0 ) newVal = 0;
						
							level.spawnLayer.set( r, c, newVal );
						} ); 
					}			
				} else {
					// Subtract firstgrid offset from each draw layer
					for (i in level.drawLayers) {
						layer = level.drawLayers[i];
						layer.map( function( r, c, val ) {
							var newVal = val - tileset.firstgid + 1;
							if ( newVal < 0 ) newVal = 0;
						
							layer.set( r, c, newVal );
						} ); 
					}
				}										
			}	

			for ( t in levelData.tilesets ) {
				tileset = levelData.tilesets[t];
				
				if ( tileset.name == "Collision" || tileset.name == "collision" ) {
					level.collisionImage = new AnimatedImage( LEVEL_DIR + tileset.image, tileset.tilewidth, tileset.tileheight, 0, 0, [] );
				} else if ( tileset.name == "Spawn" || tileset.name == "spawn" ) {		
					level.spawnImage = new AnimatedImage( LEVEL_DIR + tileset.image, tileset.tilewidth, tileset.tileheight, 0, 0, [] );	
				} else {
					level.image = new AnimatedImage(LEVEL_DIR + tileset.image, tileset.tilewidth, tileset.tileheight, 0, 0, [] );
				}										
			}				
			
			callback();
		}	
	});	
}

lrLevel.prototype.setScrollBoxInitialPosition = function(scrollBox) {
	for (var r = 0; r < this.height; r++) {
		for (var c = 0; c < this.width; c++) {
			if (this.getSpawnData(r, c) == SPAWNINDICES.startPosition) {
				console.log("Setting initial position to (" + r + ", " + c + ")");
				scrollBox.hScroll = c * this.tileWidth;
				scrollBox.vScroll = r * this.tileHeight;
				return;
			}
		}
	}
}
	
//////////////////////
// GETCOLLISIONDATA // Return data from the collision layer
////////////////////// 	
	 
/*
 * r - row
 * c - column
 */
lrLevel.prototype.getCollisionData = function( r, c ) {
	if ( this.collisionLayer == null ) return 0;
	
	return this.collisionLayer.get( r, c );
}

//////////////////
// GETSPAWNDATA // Return data from the spawn layer
////////////////// 		
	
/*
 * r - row
 * c - column
 */	
lrLevel.prototype.getSpawnData = function( r, c ) {
	if ( this.spawnLayer == null ) return 0;

	return this.spawnLayer.get( r, c );
}
	
//////////////////
// SETSPAWNDATA // Set data from the spawn layer
//////////////////	
	
/*
 * r - row
 * c - column
 * val - value to write
 */	
lrLevel.prototype.setSpawnData = function( r, c, val ) {
	if ( this.spawnLayer == null ) return;

	this.spawnLayer.set( r, c, val );
}

/////////////
// COLLIDE // Test an entity against the solid parts of the level, prevent it from going through walls
/////////////	
	
/*
 * entity - the isEntity that will be tested for collision
 */	
	
lrLevel.prototype.collide = function( entity ) {
	if ( this.collisionLayer == null ) return;
	if ( entity.isGhost ) return;

	var block = new Entity( 0, 0, this.tileWidth, this.tileHeight );

	for (var c = Math.floor( entity.posX / this.tileWidth ) - 1; c <= Math.ceil( ( entity.posX + entity.width ) / this.tileWidth ) + 1; c++ ) {
		for (var r = Math.floor( entity.posY / this.tileHeight ) - 1; r <= Math.ceil( ( entity.posY + entity.height ) / this.tileHeight ) + 1; r++ ) {
			if ( c >= 0 && c < this.width && r >= 0 && r < this.height ) {
				var index = this.collisionLayer.get( r, c );
			
				block.posX = c * this.tileWidth;
				block.posY = r * this.tileHeight;
			
				if ( index > 0 ) entity.collideWith( block );
			}
		}
	}		
}	

var rect = new Shape().Rectangle( 0, 0, 16, 16 );

var a = new Vec2( 0, 0 );
var b = new Vec2( 16, 0 );
var c = new Vec2( 16, 16 );
var d = new Vec2( 0, 16 );

var tri1 = new Shape( [ b, c, d ] );
var tri2 = new Shape( [ a, c, d ] );
var tri3 = new Shape( [ a, b, d ] );
var tri4 = new Shape( [ a, b, c ] );

lrLevel.prototype.bouncecast = function( line, maxBounces ) {
	var points = [];	
	points.push( line.p1 );

	var ray = new Ray();

	var line2 = new Line( line );

	do {
		ray = this.shapecast( line2 );
		points.push( ray.point );

		if ( ray.dir != null ) {
			line2.p1.set( ray.point )
			line2.p2.set( line2.p1.plus( ray.dir.scale( 300 ) ) );
		}

	} while( ray.dir && points.length < maxBounces);

	return points;
}

lrLevel.prototype.raycast = function( line ) {
	// Start of the ray is point 1, end is point 2
	// Copy the start and end values so we can do what we want with them without disturbing the originals
	var x1 = line.p1.x
	var x2 = line.p2.x;
	var y1 = line.p1.y;
	var y2 = line.p2.y;

	// Span of the line on the x- and y- axes. Bounds the line
	var xDiff = x2 - x1;
	var yDiff = y2 - y1;

	var lineLength = Math.sqrt( xDiff * xDiff + yDiff * yDiff );

	var unitX = xDiff / lineLength;
	var unitY = yDiff / lineLength;

	// How much line we move through to change grid position horizontally or vertically
	var deltaX, deltaY;

	if ( xDiff == 0 ) deltaX = -1;
	else deltaX = Math.sqrt( this.tileWidth * this.tileWidth + (this.tileHeight * this.tileHeight) * ( yDiff * yDiff ) / ( xDiff * xDiff ) );
	if ( yDiff == 0 ) deltaY = -1;
	else deltaY = Math.sqrt( this.tileHeight * this.tileHeight + (this.tileWidth * this.tileWidth) * ( xDiff * xDiff ) / ( yDiff * yDiff ) );
	
	// Which way to increment
	var xStep = xDiff < 0 ? -1 : 1;
		yStep = yDiff < 0 ? -1 : 1;
	
	// How much the line has progressed since we last incremented horizontally or vertically
	var xOff, yOff;

	if ( xStep > 0 ) xOff = x1 - Math.floor( x1 / this.tileWidth ) * this.tileWidth;
	else xOff = Math.ceil( x1 / this.tileWidth ) * this.tileWidth - x1;

	xOff *= Math.abs( yDiff / xDiff );

	if ( yStep > 0 ) yOff = y1 - Math.floor( y1 / this.tileHeight ) * this.tileHeight;
	else yOff = Math.ceil( y1 / this.tileHeight ) * this.tileHeight - y1;

	yOff *= Math.abs( xDiff / yDiff );

	var lengthTravelled = 0;
	var hitX = x1, hitY = y1;
	
	var x = Math.floor( x1 / this.tileWidth ),
		y = Math.floor( y1 / this.tileHeight );	

	var incident = new Vec2( x1 - x2, y1 - y2 ).normalize();
	var normal = new Vec2();
	var startX = x;
	var startY = y;

	while ( lengthTravelled < lineLength ) {

		if ( x != startX || y != startY ) {		
			if ( x < 0 || x >= this.width || y < 0 || y >= this.height ) {
				var cosine = normal.times( incident.dot( normal ) );
				dir = cosine.plus( cosine.minus( incident ) );

				return new Ray( new Vec2( hitX, hitY ), null );		
			}

			if ( this.collisionLayer.get( y, x ) == 1 ) {
				var cosine = normal.times( incident.dot( normal ) );
				dir = cosine.plus( cosine.minus( incident ) );

				return new Ray( new Vec2( hitX, hitY ), dir )
			}
		
			if ( this.collisionLayer.get( y, x ) == 2 ) {
				var l = new Line( x * this.tileWidth, ( y + 1 ) * this.tileHeight,
								 ( x + 1 ) * this.tileWidth, y * this.tileHeight );
		
				var inter = line.intersect( l );

				if ( inter != null ) {
					normal.x = -1;
					normal.y = -1;
					normal.normalize();
		
					hitX = inter.x;
					hitY = inter.y;

					var cosine = normal.times( incident.dot( normal ) );
					dir = cosine.plus( cosine.minus( incident ) );

					return new Ray( new Vec2( hitX, hitY ), dir );
				}
			}
		}

		if ( ( deltaX != -1 && deltaX - xOff < deltaY - yOff ) || deltaY == -1 ) {
			yOff += deltaX - xOff;
			lengthTravelled += deltaX - xOff;
			x += xStep;

			hitX = x * this.tileWidth;
			if ( xStep < 0 ) hitX += this.tileWidth;

			normal.x = -xStep;
			normal.y = 0;

			hitY = y1 + ( hitX - x1 ) * yDiff / xDiff;

			xOff = 0;
		} else {
			xOff += deltaY - yOff;
			lengthTravelled += deltaY - yOff;
			y += yStep;

			hitY = y * this.tileHeight;
			if ( yStep < 0 ) hitY += this.tileHeight;

			normal.x = 0;
			normal.y = -yStep;

			hitX = x1 + ( hitY - y1 ) * xDiff / yDiff;

			yOff = 0;
		}
	}

	// Didn't hit anything, return the original line
	return new Ray( new Vec2( x2, y2 ), null );
}

lrLevel.prototype.raycastSucceeds = function(line) {
	ray = this.raycast(line).ray;

	return (ray.x2 == line.p2.x && ray.y2 == line.p2.y );
}

lrLevel.prototype.drawForeground = function( context, scrollBox, layer ) {
	
	level = this;

	var drawLayer = function( layer, image, drawFunc ) {
		for (var c = scrollBox.hLoTileIndex; c < scrollBox.hHiTileIndex; c++) {
			for (var r = scrollBox.vLoTileIndex; r < scrollBox.vHiTileIndex; r++) {
				drawFunc( r, c, image, layer.get( r, c ) );
			}
		}
	}

	var drawImage = function( r, c, image, frame ) {
		if ( frame > 0 ) image.draw( context, c * scrollBox.tileW, r * scrollBox.tileH, frame, 1.0, false, false );	
	}

	var drawFill = function( r, c, image, frame ) {
		if ( frame > 0 ) context.fillRect( c * scrollBox.tileW, r * scrollBox.tileH, scrollBox.tileW, scrollBox.tileH );
	}

	context.fillStyle = "black";

	// Draw the tile layers
	for (var l = 0; l < this.drawLayers.length; l++) {			
		drawLayer( this.drawLayers[l], level.image, drawImage );
	}
	
	drawLayer( this.collisionLayer, this.collisionImage, drawImage );
	drawLayer( this.spawnLayer, this.spawnImage, drawImage );	

	context.strokeStyle = "red";

	for ( s in this.shapes ) {
		this.shapes[s].draw( context );
	}
}