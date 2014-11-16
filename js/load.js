// Functions to Preload Game Resources and Start Game
game18xx.Boot = function(){};
game18xx.Load = function(){};
game18xx.Boot.prototype.preload = function() {
//	console.log('"Boot" loading')
	// TODO: Load Splash Screen Images
};
game18xx.Boot.prototype.create = function() {
//	console.log('"Boot" created')
	this.game.stage.backgroundColor = '#ffffff';
	// TODO: Display Splash Screen
	// TODO: Set Game Settings
	this.state.start('Load');
};
game18xx.Load.prototype.preload = function() {
//	console.log('"Load" loading')
	// TODO: Load Game Images
	// Load Terrain Images
	game18xx.world.terrain.forEach(function(val) {
		game18xx.phaser.load.image('terrain.' + val, '/img/terrain/' + val + (game18xx.world.angle ? game18xx.world.angle : '') + '.png');
	});
	game18xx.phaser.load.image('activeTile', '/img/activeTile.png');
	game18xx.phaser.load.image('rotate.acw', '/img/acw.png');
	game18xx.phaser.load.image('rotate.cw', '/img/cw.png');
	game18xx.phaser.load.image('tile', '/img/tile.png');
};
game18xx.Load.prototype.create = function() {
//	console.log('"Load" created')
	game18xx.phaser.state.start('MainMenu');
};
game18xx.getTileX = function(row, col) {
	if ((!row && row !== 0) || (!col && col !== 0)) return -300;
	if (game18xx.world.angle == 90) {
		return col * 172 * game18xx.scale.x + (row % 2 ? 0 : 86 * game18xx.scale.y);
	}
	return col * 148 * game18xx.scale.x + 20;
}
game18xx.getTileY = function(row, col) {
	if ((!row && row !== 0) || (!col && col !== 0)) return -300;
	if (game18xx.world.angle == 90) {
		return row * 148 * game18xx.scale.y;
	}
	return row * 172 * game18xx.scale.y + (col % 2 ? 86 * game18xx.scale.y : 0);
}
game18xx.getTileFromXY = function(x, y) {
	var row, col
	if (game18xx.world.angle == 90) {
		row = y / 148 / game18xx.scale.y;
		col = (x - (row % 2 ? 0 : 86 * game18xx.scale.y)) / 172 / game18xx.scale.x;
	}
	row = (y - (col % 2 ? 86 * game18xx.scale.y : 0)) / 172 / game18xx.scale.y;
	col = (x - 20) / 148 / game18xx.scale.x;
	console.log('Tile ' + row + ', ' + col)
}
