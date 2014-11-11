game18xx.MainMenu = function(){};
game18xx.MainMenu.prototype.preload = function() {
//	console.log('"MainMenu" loading')
};
game18xx.MainMenu.prototype.create = function() {
//	console.log('"MainMenu" created')
	game18xx.phaser.state.start('rndOperating');
};
