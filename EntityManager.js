///////////////////
// ENTITYMANAGER //
///////////////////
/*
	v0.1

	This class handles all of the moving parts of the game - player, enemy, projectiles, boss. 
	
		doForAllEntities() - Apply a function to every entity
		clear() - utility function, kill everything
		overlapList() - utility function, try an entity against a list of entities (e.g. see if any bullet from the bullet list has hit the player)
		collide() - see if things hit each other or the walls of the level
		update() - calls the update() method of each managed entity. "Updating" means moving and making AI decisions and firing stuff.
		grab() - when a ship fires bullets they go into a "waiting room" on that ship. grab empties all the waiting rooms and adds the bullets to the game
		cull() - take out dead stuff. An entity is dead if its "removeThis" flag is set to true.
		spawn() - Certain points in the level spawn entities. Examples are the player start point and the boss room. spawn() finds those points and makes entities at them
		draw() - calls the draw() method of each managed entity
		
		
		The basic loop cycle for the entity manager looks like this:
		
			1. collide() - entities know where they can and can't go when they move
			2. update() - entities move and think
			3. grab() - entities fire bullets and stuff during update(), now we add these to the game
			4. spawn() - goes wherever grab() goes since they do similar things
			5. cull() - if something is dead, we don't want to draw it. But it may have spawned another entity on dying, so we grab() before we cull()
			6. draw() - draw stuff last so the player sees the game as it is currently
*/

var EntityManager = function() {
	this.lasers = [];
	this.entities = [];	

	this.spawns = [];
}

// Do something for each entity
// func should take a single argument, the entity
EntityManager.prototype.doForAllEntities = function( func ) {
	for ( e in this.entities ) {
		func( this.entities[e] );
	}
	for ( l in this.lasers ) {
		func( this.lasers[l] );
	}
}

EntityManager.prototype.clear = function() {

}

// Helper function
var overlapList = function( entity, entityList ) {
	for ( e in entityList ) {
		otherEntity = entityList[e];
		
		if ( entity.canOverlap( otherEntity ) && entity.overlaps( otherEntity ) ) {
			otherEntity.hitWith( entity );
			entity.hitWith( otherEntity );
		}
	}	
}

EntityManager.prototype.collide = function( level ) {
	this.doForAllEntities( function( entity ) {
		entity.clearCollisionData();
	});

	this.doForAllEntities( function( entity ) {
		if ( entity instanceof LaserGun ) {
			var line = new Line();
	
			line.p1.set( entity.p1 );
			line.p2.set( entity.p2 );
		
			entity.propagate( level.bouncecast( line, 10 ) );
		}
	});

	for ( e in this.entities ) {
		level.collide( this.entities[e] );

		overlapList( this.entities[e], this.lasers );
	}
}

EntityManager.prototype.update = function( level ) {
	this.doForAllEntities( function( entity ) {
		entity.update( level );
	});	
}
	
var cullEntityList = function( entityList ) {
	for ( e in entityList ) {
		if ( entityList[e].removeThis ) entityList.splice( e, 1 );
	}
}

EntityManager.prototype.cull = function() {
	cullEntityList( this.entities );
	cullEntityList( this.lasers )
}
	
EntityManager.prototype.grab = function() {
	var spawnedEntities = [];

	this.doForAllEntities( function( entity ) {
		while( entity.hasSpawnedEntities() ) {
			spawnedEntities.push( entity.getSpawnedEntity() );
		}
	});
		
	for (var i = 0; i < spawnedEntities.length; i++) {
		this.insert( spawnedEntities[i] );
	}
}

EntityManager.prototype.insert = function( entity ) {
	if ( entity === undefined || entity == null ) return;

	if ( entity instanceof Laser ) {
		this.lasers.push( entity );
	} else {
		this.entities.push( entity );
	}
}

EntityManager.prototype.spawn = function( level ) {
	if ( !level ) {
		console.warn( "[EntityManager.spawn] Cannot spawn from level " + level );
		return;
	}
	
	em = this;

	level.spawnLayer.map( function( r, c, val ) {
		var x = c * level.tileWidth;
		var y = r * level.tileHeight;

		if ( em.spawns[val] ) {
			em.insert( em.spawns[val]( x, y ) );
		}
	
		level.spawnLayer.set( r, c, 0 );
	} );
}	

//////////////
// ADDSPAWN //
//////////////

/*
	index is a number in the spawn layer
	func( x, y ) returns an entity
*/
EntityManager.prototype.addSpawn = function( index, func ) {
	this.spawns[index] = func;
}

EntityManager.prototype.draw = function(context, layer) {
	this.doForAllEntities( function( entity ) {
		entity.draw( context );
		if (LOG_COLLISION) entity.drawCollisionBox( context );
	});	
}