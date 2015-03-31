/**
 * 
 */
function Cursor(pos,dir) {
	
	this.pos = pos;

};

Cursor.prototype.move = function (size,dir) {
	this.pos[0] += size*Math.cos(dir);
	this.pos[1] += size*Math.sin(dir);
}

