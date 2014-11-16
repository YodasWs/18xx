game18xx.rndOperating = function(){};
game18xx.rndOperating.prototype.preload = function() {
//	console.log('"rndOperating" loading')
};
game18xx.rndOperating.prototype.create = function() {
	// Establish Input Parameters
	game18xx.cursors = game18xx.phaser.input.keyboard.createCursorKeys()
	game18xx.phaser.input.mouse.stopOnGameOut = true
	game18xx.phaser.input.stopOnGameOut = true
	game18xx.phaser.input.maxPointers = 1
	// Create World
	game18xx.phaser.world.setBounds(-1000,-1000,2000,2000)
	game18xx.phaser.camera.setPosition(0, 0)
	game18xx.world.tiles.forEach(function(item, i) {
		var x = game18xx.getTileX(item.row, item.col),
			y = game18xx.getTileY(item.row, item.col),
			r = 200 * game18xx.scale.x,
			item = Object.extendIfEmpty(item, game18xx.defaults.location),
			tile = item.terrain ? 'terrain.' + item.terrain : 'tile'
		game18xx.board.push(game18xx.phaser.add.sprite(x, y, tile))
		game18xx.board[i].inputEnabled = true
		game18xx.board[i].input.pixelPerfectClick = true
		if (item.terrain != 'water')
			game18xx.board[i].events.onInputDown.add(game18xx.activateBoardTile, game18xx.board[i])
		Object.extendIfEmpty(game18xx.board[i], item, game18xx.defaults.tile, {index:i})
		Object.extend(game18xx.board[i].scale, game18xx.scale)
		// Add City Overlay
//		if (game18xx.board[i].city) {
//			game18xx.board[i].overlay = game18xx.phaser.add.sprite(x, y, 'city');
//			game18xx.board[i].overlay.frame = frmOverlays.city[game18xx.board[i].city];
//			game18xx.board[i].overlay.scale.x = game18xx.scale.x;
//			game18xx.board[i].overlay.scale.y = game18xx.scale.y;
//			Object.extend(game18xx.board[i].overlay, game18xx.defaults.overlay);
//		}
//		game18xx.phaser.world.add(game18xx.board[i])
	});
	// Load Track Tiles
	game18xx.trackTiles.forEach(function(tile, i) {
		var x = 730,
			y = 70 * (i % 5) + 20,
			j = game18xx.phaser.add.sprite(x, y, 'tile')
		j.fixedToCamera = true
		j.visible = false
		game18xx.trackTiles[i] = Object.extend(j, tile)
		Object.extendIfEmpty(game18xx.trackTiles[i], game18xx.defaults.tile)
		Object.extend(game18xx.trackTiles[i].scale, game18xx.scale)
		game18xx.trackTiles[i].inputEnabled = true
		game18xx.trackTiles[i].events.onInputDown.add(game18xx.selectTrack, game18xx.trackTiles[i])
	});
	// Active Tile Sprites
	game18xx.activeTile = game18xx.phaser.add.sprite(0, 0, 'activeTile')
	Object.extend(game18xx.activeTile.scale, game18xx.scale)
	game18xx.activeTile.visible = false
	// Control Sprites
	game18xx.controls = {
		acw:game18xx.phaser.add.sprite(735, 0, 'rotate.acw'),
		cw:game18xx.phaser.add.sprite(769, 0, 'rotate.cw'),
		hideAll:function(){
			for (var i in game18xx.controls) {
				if (game18xx.controls[i] instanceof Phaser.Sprite)
					game18xx.controls[i].visible = false
			}
		},
		showAll:function(){
			for (var i in game18xx.controls) {
				if (game18xx.controls[i] instanceof Phaser.Sprite)
					game18xx.controls[i].visible = true
			}
		},
		hide:function(){
			for (var i=0; i<arguments.length; i++)
				if (game18xx.controls[arguments[i]] instanceof Phaser.Sprite)
					game18xx.controls[arguments[i]].visible = false
		},
		show:function(){
			for (var i=0; i<arguments.length; i++)
				if (game18xx.controls[arguments[i]] instanceof Phaser.Sprite)
					game18xx.controls[arguments[i]].visible = true
		}
	};
	game18xx.controls.hideAll()
	for (var i in game18xx.controls) {
		if (!(game18xx.controls[i] instanceof Phaser.Sprite)) continue
		game18xx.controls[i].fixedToCamera = true
		game18xx.controls[i].inputEnabled = true
		game18xx.controls[i].events.onInputDown.add(game18xx.rotateTileSelection, game18xx.controls[i])
	}
//	console.log('"rndOperating" created')
};
// Render Tile Outline, Track, and City
game18xx.rndOperating.tile = function(item) {
	var i = 0, // Vertex Counter
		α = game18xx.world.angle ? game18xx.world.angle : 0, // Angle of Vertix from x-axis
		c1 = game18xx.phaser.canvas.getContext('2d'), // Canvas Context
		x1 = item.x, y1 = item.y, // Tile Placement
		r = 100 * game18xx.scale.x, // Tile Radius
		cx = x1 + r - game18xx.phaser.camera.x, // Tile Center Point
		cy = y1 + r - game18xx.phaser.camera.y, // Tile Center Point
		x2, y2, // Point 2 for Border Path
		b, // Border Marker
		hex = [] // Hex Outline
	x1 = Math.cos(α * Math.PI / 180) * r
	y1 = Math.sin(α * Math.PI / 180) * r
	// Draw Tile Borders
	if (item.trackLevel || item.open) {
		for(; i < 6; i++) {
			// Calculate Border Vertices
			x1 = Math.cos(α * Math.PI / 180) * r
			y1 = Math.sin(α * Math.PI / 180) * r
			α += 60; if (α >= 360) α -= 360
			x2 = Math.cos(α * Math.PI / 180) * r
			y2 = Math.sin(α * Math.PI / 180) * r
			hex.push([cx+x2,cy+y2])
			// Determine if Track can cross border
			b = ['n','h','u','i','k','m'][i]
			if (!item.open || item.open.indexOf(b) == -1) continue
			// Draw Border
			c1.beginPath()
			c1.strokeStyle = 'black'
			c1.fillStyle = 'transparent'
			c1.lineJoin = 'round'
			c1.lineCap = 'round'
			c1.lineWidth = 1
			c1.globalAlpha = 1
//			c1.strokeStyle = (item.open.indexOf(b) == -1) ? 'red' : 'black'
			c1.moveTo(cx + x1, cy + y1)
			c1.lineTo(cx + x2, cy + y2)
			c1.fill();c1.stroke()
		}
		if (item.trackLevel) {
			c1.beginPath()
			c1.strokeStyle = 'transparent'
			c1.moveTo(hex[5][0], hex[5][1])
			hex.forEach(function(p) {
				c1.lineTo(p[0], p[1])
			})
			c1.closePath()
			c1.globalAlpha = (item.bgColor && item.bgColor == 'white') ? 1 : .2
			c1.fillStyle = item.bgColor ? item.bgColor : game18xx.tileColor[item.trackLevel]
			c1.fill();c1.stroke()
		}
	}
	c1.globalAlpha = 1
	// Draw Track
	if (item.track && item.track.length) item.track.forEach(function(t) {
		var l = ['n','h','u','i','k','m'], a = l.indexOf(t[0]), x1, y1, x2, y2
		if (a == -1) return // Improper Track Alignment
		// Start Track Path
		c1.beginPath()
		c1.fillStyle = 'transparent'
		c1.strokeStyle = 'black'
		c1.lineJoin = 'round'
		c1.lineCap = 'butt'
		c1.lineWidth = 5
		// Calculate Track Points
		t.forEach(function(p, i) {
			a = l.indexOf(p)
			if (a == -1) return
			// Border Vertex 1
			x1 = Math.cos((a * 60 + game18xx.world.angle) * Math.PI / 180) * r
			y1 = Math.sin((a * 60 + game18xx.world.angle) * Math.PI / 180) * r
			// Border Vertex 2
			x2 = Math.cos(((a+1) * 60 + game18xx.world.angle) * Math.PI / 180) * r
			y2 = Math.sin(((a+1) * 60 + game18xx.world.angle) * Math.PI / 180) * r
			// Track End Point
			x1 = (x1 + x2) / 2, y1 = (y1 + y2) / 2
			// For PRR's Start Tile, Reroute Around City
			if (item.stations && Math.abs(l.indexOf(t[0]) - l.indexOf(t[i])) == 3) {
				x2 = Math.cos(((a-1) * 60 + game18xx.world.angle) * Math.PI / 180) * r
				y2 = Math.sin(((a-1) * 60 + game18xx.world.angle) * Math.PI / 180) * r
				x3 = Math.cos(((a-2) * 60 + game18xx.world.angle) * Math.PI / 180) * r
				y3 = Math.sin(((a-2) * 60 + game18xx.world.angle) * Math.PI / 180) * r
				c1.bezierCurveTo(cx+x3/2, cy+y3/2, cx + x3, cy + y3, cx + 2*x2/3, cy + 2*y2/3)
				x2 = Math.cos((a * 60 + game18xx.world.angle) * Math.PI / 180) * r
				y2 = Math.sin((a * 60 + game18xx.world.angle) * Math.PI / 180) * r
				c1.bezierCurveTo(cx + x2, cy + y2, cx+x2/2, cy+y2/2, cx + x1, cy + y1)
			} else if (i == 0) {
				// Track Start Point
				c1.moveTo(cx + x1, cy + y1)
				// Terminal Track
				if (t.length == 1) {
					x2 = x1 / 3, y2 = y1 / 3
					c1.lineTo(cx + x2, cy + y2)
				}
			} else {
				// Curve to Track End
				c1.quadraticCurveTo(cx, cy, cx + x1, cy + y1)
			}
		})
		c1.fill();c1.stroke()
		if (t.indexOf('town') != -1) {
			// TODO: Place on Tracks
			game18xx.rndOperating.drawTown(cx,cy)
		}
	})
	// Draw Station
	if (item.stations && item.stations.length) {
		c1.beginPath()
		c1.strokeStyle = 'black'
		c1.fillStyle = item.stations[0] == 0 ? 'transparent' : 'red'
		c1.lineWidth = 2
		c1.arc(cx, cy, r / 3, 0, 7, 0)
		c1.fill();c1.stroke()
	}
	// Draw Towns
	if (item.towns) {
		if (!item.track) {
			game18xx.rndOperating.drawTown(cx,cy)
		}
		// TODO: Add Town Not Along Tracks
	}
};
game18xx.rndOperating.drawTown = function(x,y) {
	var c = game18xx.phaser.canvas.getContext('2d')
	c.beginPath()
	c.strokeStyle = 'black'
	c.fillStyle = 'black'
	c.lineWidth = 2
	c.arc(x, y, 100 * game18xx.scale.x / 8, 0, 7, 0)
	c.fill();c.stroke()
};
game18xx.rndOperating.prototype.render = function() {
	var c1 = game18xx.phaser.canvas.getContext('2d') // Canvas Context
	// Render Game Board Tiles
	game18xx.board.forEach(function(item) {
		item.x = game18xx.getTileX(item.row, item.col)
		item.y = game18xx.getTileY(item.row, item.col)
		game18xx.rndOperating.tile(item)
	})
	// Render Available Tile Pieces
	if (game18xx.rndOperating.stage == 'track') {
		game18xx.trackTiles.forEach(function(tile, i) {
			if (game18xx.rndOperating.trackLevel < tile.trackLevel || !tile.visible) {
				return
			}
			game18xx.rndOperating.tile({x:tile.x,y:tile.y,trackLevel:1,bgColor:'white'})
			game18xx.rndOperating.tile(tile)
		})
	}
};
game18xx.rndOperating.prototype.update = function() {
	// Scroll Board
	var c = game18xx.phaser.camera
	if (game18xx.cursors.up.isDown) c.y -= 10
	else if (game18xx.cursors.down.isDown) c.y += 10
	if (game18xx.cursors.left.isDown) c.x -= 10
	else if (game18xx.cursors.right.isDown) c.x += 10
};
game18xx.activateBoardTile = function(loc) {
	var num = 0
	if(game18xx.phaser.input.worldX==-1&&game18xx.phaser.input.worldY==-1)return
//	console.log('Clicked tile ' + loc.row + 'x' + loc.col)
	game18xx.activeTile.visible = false
	game18xx.controls.hideAll()
	if (game18xx.rndOperating.stage == 'track') {
		game18xx.trackTiles.forEach(function(tile, i) {
			// Check Tile Track Level
			if (game18xx.rndOperating.trackLevel < tile.trackLevel || loc.trackLevel + 1 != tile.trackLevel) {
				return game18xx.trackTiles[i].visible = false
			}
			// Check for Existence of Stations
			if ((!loc.stations && tile.stations) || (!tile.stations && loc.stations)) {
				return game18xx.trackTiles[i].visible = false
			}
			// Check Tile Names Match
			if ((tile.trackCode && !loc.trackCode) || (loc.trackCode && (!tile.trackCode || loc.trackCode != tile.trackCode))) {
				return game18xx.trackTiles[i].visible = false
			}
			// Display Good Track Tile Options
			num++
			Object.extend(game18xx.trackTiles[i], {
				visible:true,
				y:70 * (num % 8) + 20,
				x:730 - Math.floor(num / 5) * 70,
			})
			Object.extend(game18xx.activeTile, {
				visible:true,
				row:loc.row,
				col:loc.col,
				x:game18xx.getTileX(loc.row, loc.col),
				y:game18xx.getTileY(loc.row, loc.col),
				index:loc.index
			})
			game18xx.controls.show('cw','acw')
		})
	} else if (game18xx.rndOperating.stage == 'run') {
		if (loc.stations) {
			game18xx.phaser.paused = true
			console.log('This tile has a city!')
			$('canvas').hide()
			$('aside#railways').show()
		} else {
			console.log('No city here...')
			$('aside#railways').hide()
		}
	}
};
game18xx.deactivateBoardTile = function(loc) {
	game18xx.activeTile.visible = false
	game18xx.controls.hideAll()
	game18xx.trackTiles.forEach(function(t) {
		t.visible = false
	})
};
game18xx.rndOperating.trackLevel = 2
game18xx.rndOperating.stage = 'track'
game18xx.selectTrack = function(tile) {
	var validTile = true
	// TODO: Verify Track Points to Open Borders
	tile.track.forEach(function(p,i){
		if (!validTile) return // Don't waste time
		p.forEach(function(p1,j){
			if (!validTile) return // Don't waste time
			if (game18xx.board[game18xx.activeTile.index].open.indexOf(p1) == -1) validTile = false
		})
	})
	if (!validTile) return // Can't Place Track
	// Verify Track Replacement
	if (game18xx.board[game18xx.activeTile.index].track)
	game18xx.board[game18xx.activeTile.index].track.forEach(function(t,i){
		if (!validTile) return // Don't waste time
		var inArray = false
		tile.track.forEach(function(p,j){
			if (t.length != p.length) return
			var matchingEnds = 0
			t.forEach(function(t1,k){
				if (p.indexOf(t1) != -1) matchingEnds++
			})
			if (matchingEnds == p.length) inArray = true
		})
		if (!inArray) validTile = false
	})
	if (!validTile) return // Can't Place Track
	// Copy Track Tile onto Board
	game18xx.board[game18xx.activeTile.index].track = new Array()
	tile.track.forEach(function(t) {
		game18xx.board[game18xx.activeTile.index].track.push(t.slice(0))
	})
	Object.extend(game18xx.board[game18xx.activeTile.index], {trackLevel:tile.trackLevel})
	game18xx.deactivateBoardTile()
};
game18xx.rotateTileSelection = function(dir) {
	var l = ['n','h','u','i','k','m'],
		d = (dir.key == 'rotate.acw') ? -1 : 1
	game18xx.trackTiles.forEach(function(tile, i) {
		if (!tile.visible) return
		game18xx.trackTiles[i].track.forEach(function(t, j) {
			t.forEach(function(s, k) {
				var x = l.indexOf(s)
				if (x+d < 0) x += l.length
				game18xx.trackTiles[i].track[j][k] = l[(x+d) % l.length]
			})
		})
	})
};
