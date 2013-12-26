define( ["juego/Sound"], function( Sound ) {

SOUND = {
	die: new Sound( "./snd/die.ogg" ),
	jump: new Sound( "./snd/jump.ogg" ),
	laser: new Sound( "./snd/laser.ogg" ),
	song: new Sound( "./snd/song.ogg" ),
}

return SOUND;

});