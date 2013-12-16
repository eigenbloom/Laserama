///////////
// DEBUG //
///////////
/*
	Debugging functions	
*/

var Debug = function() {
	var actions = [];
}

Debug.prototype.addDebugKey = function( keyCode, Name, Action ) {
	actions[keyCode] = {name: Name, action: Action};
};



setInterval( );