game18xx.rndOperating = function(){};
game18xx.rndOperating.prototype.preload = function() {
//	console.log('"rndOperating" loading')
};
game18xx.rndOperating.prototype.create = function() {
	game18xx.phaser.world.setBounds(-1000,-1000,2000,2000)
	game18xx.cursors = game18xx.phaser.input.keyboard.createCursorKeys()
//	game18xx.phaser.camera.setPosition(-game18xx.phaser.camera.width / 2, -game18xx.phaser.camera.height / 2)
	game18xx.phaser.camera.setPosition(0, 0)
	game18xx.world.tiles.forEach(function(item, i) {
		var x = game18xx.getTileX(item.row, item.col);
		var y = game18xx.getTileY(item.row, item.col);
		var r = 200 * game18xx.scale.x
		var tile = item.terrain ? 'terrain.' + item.terrain : 'tile';
		if (tile == 'terrain.grass') tile = '';
		$.extend(game18xx.world.tiles[i], game18xx.phaser.add.sprite(x, y, tile), game18xx.defaults.tile);
		$.extend(game18xx.world.tiles[i].scale, game18xx.scale)
//		game18xx.phaser.add.text(x+60*game18xx.scale.x, y+100*game18xx.scale.y, game18xx.world.tiles[i].col + '×' + game18xx.world.tiles[i].row, {
//			font: '12pt Arial', fill: 'lightgrey', align: 'center'
//		});
		// Add City Overlay
//		if (game18xx.world.tiles[i].city) {
//			game18xx.world.tiles[i].overlay = game18xx.phaser.add.sprite(x, y, 'city');
//			game18xx.world.tiles[i].overlay.frame = frmOverlays.city[game18xx.world.tiles[i].city];
//			game18xx.world.tiles[i].overlay.scale.x = game18xx.scale.x;
//			game18xx.world.tiles[i].overlay.scale.y = game18xx.scale.y;
//			$.extend(game18xx.world.tiles[i].overlay, game18xx.defaults.overlay);
//		}
	});
//	console.log('"rndOperating" created')
};
// Render Tile Outline and Track
game18xx.rndOperating.tile = function(item) {
	var i = 0, // Vertex Counter
		α = game18xx.world.angle ? game18xx.world.angle : 0, // Angle of Vertix from x-axis
		c1 = document.getElementsByTagName('canvas')[0].getContext('2d'), // Canvas Context
		x1 = game18xx.getTileX(item.row, item.col), // Point 1 for Border Path
		y1 = game18xx.getTileY(item.row, item.col), // Point 1 for Border Path
		r = 100 * game18xx.scale.x, // Tile Radius
		cx = x1 + r - game18xx.phaser.camera.x, // Tile Center Point
		cy = y1 + r - game18xx.phaser.camera.y, // Tile Center Point
		x2, y2, // Point 2 for Border Path
		b // Border Marker
	x1 = Math.cos(α * Math.PI / 180) * r
	y1 = Math.sin(α * Math.PI / 180) * r
	// Draw Tile Borders
	for(; i < 6; i++) {
		// Calculate Border Vertices
		x1 = Math.cos(α * Math.PI / 180) * r
		y1 = Math.sin(α * Math.PI / 180) * r
		α += 60; if (α >= 360) α -= 360
		x2 = Math.cos(α * Math.PI / 180) * r
		y2 = Math.sin(α * Math.PI / 180) * r
		// Determine if Track can cross border
		b = ['n','h','u','i','k','m'][i]
		if (item.open.indexOf(b) == -1) continue
		// Draw Border
		c1.beginPath()
		c1.strokeStyle = 'black'
		c1.lineJoin = 'round'
		c1.lineCap = 'round'
		c1.lineWidth = 1
		c1.moveTo(cx + x1, cy + y1)
		c1.lineTo(cx + x2, cy + y2)
		c1.stroke()
	}
	// Draw Track
	if (item.track && item.track.length) item.track.forEach(function(t) {
		var a = ['n','h','u','i','k','m'].indexOf(t[0]), x1, y1, x2, y2
		if (a == -1) return // Improper Track Alignment
		// Start Track Path
		c1.beginPath()
		c1.strokeStyle = 'black'
		c1.lineJoin = 'miter'
		c1.lineCap = 'butt'
		c1.lineWidth = 5
		// Calculate Track Points
		t.forEach(function(p, i) {
			a = ['n','h','u','i','k','m'].indexOf(p)
			// Border Vertex 1
			x1 = Math.cos((a * 60 + game18xx.world.angle) * Math.PI / 180) * r
			y1 = Math.sin((a * 60 + game18xx.world.angle) * Math.PI / 180) * r
			// Border Vertex 2
			x2 = Math.cos(((a+1) * 60 + game18xx.world.angle) * Math.PI / 180) * r
			y2 = Math.sin(((a+1) * 60 + game18xx.world.angle) * Math.PI / 180) * r
			// Track End Point
			x1 = (x1 + x2) / 2, y1 = (y1 + y2) / 2
			if (i == 0) {
				c1.moveTo(cx + x1, cy + y1)
			} else {
				c1.quadraticCurveTo(cx, cy, cx + x1, cy + y1)
			}
			// Terminal Track
			if (t.length == 1) {
				x2 = x1 / 3, y2 = y1 / 3
				c1.lineTo(cx + x2, cy + y2)
			}
		})
		c1.stroke()
	})
	// Draw Station
	if (item.stations && item.stations.length) {
		c1.beginPath()
		c1.strokeStyle = 'black'
		c1.fillStyle = item.stations[0] == 0 ? 'transparent' : 'red'
		c1.lineWidth = 2
		c1.arc(cx, cy, r / 3, 0, 7, 0)
		c1.fill()
		c1.stroke()
	}
};
game18xx.rndOperating.prototype.render = function() {
	game18xx.world.tiles.forEach(function(item) {
		game18xx.rndOperating.tile(item)
	})
};
game18xx.rndOperating.prototype.update = function() {
	var c = game18xx.phaser.camera
	if (game18xx.cursors.up.isDown) c.y -= 100
	else if (game18xx.cursors.down.isDown) c.y += 100
	if (game18xx.cursors.left.isDown) c.x -= 100
	else if (game18xx.cursors.right.isDown) c.x += 100
};
