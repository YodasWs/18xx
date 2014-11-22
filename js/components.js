game18xx.Component = function Component(name) {
	Object.defineProperty(this, 'name', {
		get: function() { return name },
		enumerable: true
	})
}
game18xx.City = function City(name, size, income, position) {
	if (typeof position.row === 'undefined' || typeof position.col === 'undefined'
		|| !Number.isInteger(position.row) || !Number.isInteger(position.col))
		throw new TypeError("Invalid position for city: " + JSON.stringify(position))
	game18xx.Component.call(this, name)
	var stations = []
	Object.defineProperty(this, 'stations', {
		get: function() { return stations },
		enumerable: true
	})
	Object.defineProperty(this, 'income', {
		get: function() { return income },
		enumerable: true
	})
	this.addStation = function(company) {
		if (stations.length >= size || this.hasStation(company)) return false
		return !! stations.push(company)
	}
	this.hasStation = function(company) {
		console.log('checking for ' + company + ': ' + stations.indexOf(company))
		return stations.indexOf(company) !== -1
		for (var i=0; i<stations.length; i++) {
			if (stations[i] == company) return true
		}
		return false
	}
	this.canPassThru = function(company) {
		return stations.length < size || this.hasStation(company)
	}
}
game18xx.City.prototype = Object.create(game18xx.Component.prototype)
game18xx.City.prototype.constructor = game18xx.City
game18xx.Train = function Train(fuel, size) {
	Object.defineProperty(this, 'fuel', {
		get: function() { return fuel },
		enumerable: true
	})
	Object.defineProperty(this, 'size', {
		get: function() { return size },
		enumerable: true
	})
}
game18xx.Station = function Station(city, owner) {
	Object.defineProperty(this, 'owner', {
		get: function() { return owner },
		enumerable: true
	})
	Object.defineProperty(this, 'city', {
		get: function() { return city },
		enumerable: true
	})
}
game18xx.Railway = function Railway(name, par) {
	game18xx.Component.call(this, name)
	var price = {x: 5, y: 0}
	game18xx.priceTable.forEach(function(a, i) {
		if (game18xx.priceTable[i][price.x] == par) {
			price.y = i
		}
	})
	Object.defineProperty(this, 'par', {
		get: function() { return par },
		enumerable: true
	})
	this.pricePoint = function() {
		return price
	}
	Object.defineProperty(this, 'price', {
		get: function() { return game18xx.priceTable[price.y][price.x] },
		enumerable: true
	})
	this.raisePrice = function() {
		if (--price.y < 0)
			price.y = 0
	}
	this.lowerPrice = function() {
		if (++price.y >= game18xx.priceTable.length) {
			price.y = game18xx.priceTable.length - 1
			price.x--
		}
		while (price.x >= game18xx.priceTable[price.y].length)
			price.x--
		if (price.x <= 0) price.x = 0
	}
	this.payDividends = function() {
		if (++price.x >= game18xx.priceTable[price.y].length) {
			price.x = game18xx.priceTable[price.y].length - 1
			this.raisePrice()
		}
	}
	this.withhold = function() {
		if (--price.x < 0) {
			price.x = 0
			this.lowerPrice()
		}
	}
	var capital = 0
	Object.defineProperty(this, 'capital', {
		get: function() { return capital },
		enumerable: true
	})
	var shares = 0
	this.issueShares = function() {
		if (shares > 0) this.lowerPrice()
		shares += 10
	}
	this.president
	var companies = []
	this.consumeCompany = function(i) {
		if (!game18xx.companies[i]) return false
		game18xx.companies[i].owner = this.name
		companies.push(game18xx.companies.splice(i, 1)[0])
	}
	this.subsidiaries = function() {
		var subs = []
		for (i=0; i<companies.length; i++) {
			subs.push(companies[i].name)
		}
		return subs
	}
	var trains = []
	Object.defineProperty(this, 'trains', {
		get: function() { return trains },
		enumerable: true
	})
	this.buyTrain = function(train, price) {
		if (!price || Number.isNaN(price) || price <= 0)
			throw new RangeError("Invalid price: " + price)
		capital -= price
		trains.push(train)
	}
	this.sellTrain = function(i, price) {
		if (!Number.isInteger(i))
			throw new TypeError('Expected Integer, instead received ' + i.constructor.name)
		if (i < 0 || i >= trains.length)
			throw new RangeError('Invalid index: ' + i)
		if (!price || Number.isNaN(price) || price <= 0)
			throw new RangeError('Invalid price: ' + price)
		capital += price
		this.loseTrain(i)
	}
	this.loseTrain = function(i) {
		if (!Number.isInteger(i))
			throw new TypeError('Expected Integer, instead received ' + i.constructor.name)
		if (i < 0 || i >= trains.length)
			throw new RangeError('Invalid index: ' + i)
		trains.splice(i, 1)
	}
	var stations = []
	Object.defineProperty(this, 'stations', {
		get: function() { return stations },
		enumerable: true
	})
	this.buildStation = function(cityName) {
		var city = game18xx.cities.indexOf(cityName)
		if (city === false || city == -1) throw "Could not find city " + cityName
		return game18xx.cities[city].addStation(this.name)
	}
}
game18xx.Railway.prototype = Object.create(game18xx.Component.prototype)
game18xx.Railway.prototype.constructor = game18xx.Railway
game18xx.Company = function Company(name, price) {
	var owner
	game18xx.Component.call(this, name)
	Object.defineProperty(this, 'price', {
		get: function() { return price },
		enumerable: true
	})
	Object.defineProperty(this, 'owner', {
		get: function() { return owner },
		set: function(newOwner) {
			// TODO: Check that newOwner Exists
			// TODO: Update owner
		},
		enumerable: true
	})
}
game18xx.Company.prototype = Object.create(game18xx.Component.prototype)
game18xx.Company.prototype.constructor = game18xx.Company
game18xx.Player = function Player(name) {
	game18xx.Component.call(this, name)
	var wealth = 6000, portfolio = {
		companies:[],
		stocks:{}
	}
	Object.defineProperty(this, 'wealth', {
		get: function() { return wealth },
		enumerable: true
	})
	this.buyStock = function(rr) {
	}
}
game18xx.Player.prototype = Object.create(game18xx.Component.prototype)
game18xx.Player.prototype.constructor = game18xx.Player
game18xx.priceTable = [
	[100],
	[90],
	[80],
	[70],
	[60],
	[50],
	[40],
	[30],
	[20],
	[10]
]
;(function() {
for (var i=1; i<12; i++) {
	game18xx.priceTable.forEach(function(a, j) {
		var mul = 2;
		if (i > 5 && j < 1) mul = Math.max(mul, 10);
		if (i > 6 && j < 4) mul = Math.max(mul, 4);
		if (i > 5 && j < 2) mul = Math.max(mul, 5);
		if (i > 8 && j < 2) mul = Math.max(mul, 15);
		if (i > 7 && j < 5) mul = Math.max(mul, 5);
		if (i * j > 45) return true
		game18xx.priceTable[j].push(game18xx.priceTable[j][i-1] + mul)
	})
}})()
game18xx.List = function List(expectedObjectClass) {
	this.add = function(item) {
		if (!(item instanceof expectedObjectClass))
			throw new TypeError('Expected ' + expectedObjectClass.name + ', instead received ' + item.constructor.name)
		if (this.indexOf(item.name) !== false)
			return false
		return !! this.push(item)
	}
};
game18xx.List.prototype = Object.create(Array.prototype)
game18xx.List.prototype.constructor = game18xx.List
game18xx.List.prototype.indexOf = function(name) {
	for (var i=0; i<this.length; i++) {
		if (this[i].name == name) return i
	}
	return false
}
game18xx.companies = new game18xx.List(game18xx.Company)
game18xx.railways = new game18xx.List(game18xx.Railway)
game18xx.cities = new game18xx.List(game18xx.City)
