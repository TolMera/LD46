// BUGS

// I don't think we can acutally fly to Neptune? I seems to be beyond the edge of the map.



const planets = {
	mercury: {
		wealth: 500000,
		air: 0,
		iron: 0,
		methane: 0,
		protine: 0,
		population: 0,
		sugars: 0,
		acids: 0,
		water: 0,
		players: {}
	},
	venus: {
		wealth: 1000000,
		air: 0,
		iron: 0,
		methane: 0,
		protine: 0,
		population: 0,
		sugars: 0,
		acids: 0,
		water: 0,
		players: {}
	},
	earth: {
		wealth: 1500000,
		air: 0,
		iron: 0,
		methane: 0,
		protine: 0,
		population: 0,
		sugars: 0,
		acids: 0,
		water: 0,
		players: {}
	},
	mars: {
		wealth: 2000000,
		air: 0,
		iron: 0,
		methane: 0,
		protine: 0,
		population: 0,
		sugars: 0,
		acids: 0,
		water: 0,
		players: {}
	},
	uranus: {
		wealth: 3000000,
		air: 0,
		iron: 0,
		methane: 0,
		protine: 0,
		population: 0,
		sugars: 0,
		acids: 0,
		water: 0,
		players: {}
	},
	neptune: {
		wealth: 4000000,
		air: 0,
		iron: 0,
		methane: 0,
		protine: 0,
		population: 0,
		sugars: 0,
		acids: 0,
		water: 0,
		players: {}
	},
}
const users = [];
const orders: Array<{ to: string, type: string, quantity: number, price: number }> = [
	// { to: "mars", type: "acids", quantity: 100, price: 1 },
];

let EXPRESS = require('express');
let CORS = require('cors');
let COMPRESSION = require('compression');
let PATH = require('path');
const BODYPARSER = require('body-parser');

const express = EXPRESS();

express.use(CORS());
express.use(COMPRESSION());
express.use(BODYPARSER());

// Login CRUD

express.get('/', function (request, response) {
	response.sendFile(PATH.join(__dirname + '/../../GUI/index.html'));
});

express.get('/index.html', function (request, response) {
	response.sendFile(PATH.join(__dirname + '/../../GUI/index.html'));
});

express.get('/css.css', function (request, response) {
	response.sendFile(PATH.join(__dirname + '/../../GUI/css.css'));
});

express.get('/bundle.js', function (request, response) {
	response.sendFile(PATH.join(__dirname + '/../../GUI/bundle.js'));
});

for (let planet of ["earth", "jupiter", "mars", "mercury", "moon", "neptune", "saturn", "stars", "sun", "uranus", "venus"]) {
	express.get(`/Planets/Textures/${planet}.jpg`, function (request, response) {
		response.sendFile(PATH.join(__dirname + `/../../GUI/Planets/Textures/${planet}.jpg`));
	});

	express.get(`/Planets/sphere/${planet}.png`, function (request, response) {
		response.sendFile(PATH.join(__dirname + `/../../GUI/Planets/sphere/${planet}.png`));
	});
}

for (let file of ["BeepBoxSong1.mp3", "BeepBoxSong2.mp3", "BeepBoxSong3.mp3", "BeepBoxSong4.mp3", "BeepBoxSong5.mp3", "BeepBoxSong6.mp3", "BeepBoxSong7.mp3"]) {
	express.get(`/Music/${file}`, function (request, response) {
		response.sendFile(PATH.join(__dirname + `/../../GUI/Music/${file}`));
	});
}

for (let file of ["ship1.png", "arrow.png"]) {
	express.get(`/Art/${file}`, function (request, response) {
		response.sendFile(PATH.join(__dirname + `/../../GUI/Art/${file}`));
	});
}

express.get('/login', function (request, response) {
	console.log(request.query);
	let isNew = true;
	let accountId = request.query.accountId;

	for (let user of users) {
		if (accountId == user.accountId) {
			isNew = false;
			break;
		}
	}

	if (isNew) {
		users.push({
			accountId
		});

		console.log("New user", accountId);

		return response.send({
			isNew
		});
	} else {
		console.log("User loged in", accountId);

		return response.send({
			isNew,

		});
	}
});

express.get('/orders', function (request, response) {
	response.send(orders);
});

express.post('/orders', function (request, response) {
});


// Goods
const goods = {
	mercury: [
		// mercury: ["air", "iron", "methane", "protine", "sugar"],
		{ name: "Air (N2 + O2 + CO2)", mass: 870, price: 10, stock: 100 },
		{ name: "Iron (Fe)", mass: 7873, price: 10, stock: 100 },
		{ name: "Liquid Methane (CH4)", mass: 424, price: 30, stock: 10000 },
		{ name: "Proteins", mass: 3500, price: 10, stock: 0 },
		{ name: "People", mass: 1500, price: 20, stock: planets["mercury"].population },
		{ name: "Sugars (C6H12O6)", mass: 2000, price: 2, stock: 0 },
		{ name: "Sulphuric Acid (H2SO4)", mass: 1826, price: 1, stock: 0 },
		{ name: "Water (H2O)", mass: 1000, price: 40, stock: 100 },
	],
	venus: [
		// venus: ["water", "air", "acid", "methane"],
		{ name: "Air (N2 + O2 + CO2)", mass: 870, price: 3, stock: 100 },
		{ name: "Iron (Fe)", mass: 7873, price: 1, stock: 0 },
		{ name: "Liquid Methane (CH4)", mass: 424, price: 20, stock: 10000 },
		{ name: "Proteins", mass: 3500, price: 10, stock: 0 },
		{ name: "People", mass: 1500, price: 10, stock: planets["venus"].population },
		{ name: "Sugars (C6H12O6)", mass: 2000, price: 5, stock: 0 },
		{ name: "Sulphuric Acid (H2SO4)", mass: 1826, price: 1, stock: 1000 },
		{ name: "Water (H2O)", mass: 1000, price: 5, stock: 100 },
	],
	earth: [
		// earth: ["water", "air", "acid", "iron", "methane", "protine", "sugar"],
		{ name: "Air (N2 + O2 + CO2)", mass: 870, price: 1, stock: 10000 },
		{ name: "Iron (Fe)", mass: 7873, price: 15, stock: 0 },
		{ name: "Liquid Methane (CH4)", mass: 424, price: 10, stock: 10000 },
		{ name: "Proteins", mass: 3500, price: 20, stock: 0 },
		{ name: "People", mass: 1500, price: -10, stock: planets["earth"].population },
		{ name: "Sugars (C6H12O6)", mass: 2000, price: 2, stock: 0 },
		{ name: "Sulphuric Acid (H2SO4)", mass: 1826, price: 1, stock: 0 },
		{ name: "Water (H2O)", mass: 1000, price: 1, stock: 10000 },
	],
	mars: [
		// mars: ["air", "iron", "methane", "sugar"],
		{ name: "Air (N2 + O2 + CO2)", mass: 870, price: 10, stock: 100 },
		{ name: "Iron (Fe)", mass: 7873, price: 10, stock: 1000 },
		{ name: "Liquid Methane (CH4)", mass: 424, price: 10, stock: 10000 },
		{ name: "Proteins", mass: 3500, price: 20, stock: 0 },
		{ name: "People", mass: 1500, price: 20, stock: planets["mars"].population },
		{ name: "Sugars (C6H12O6)", mass: 2000, price: 1, stock: 0 },
		{ name: "Sulphuric Acid (H2SO4)", mass: 1826, price: 1, stock: 0 },
		{ name: "Water (H2O)", mass: 1000, price: 30, stock: 100 },
	],
	uranus: [
		// uranus: ["water", "air", "acid", "methane"],
		{ name: "Air (N2 + O2 + CO2)", mass: 870, price: 5, stock: 100 },
		{ name: "Iron (Fe)", mass: 7873, price: 30, stock: 0 },
		{ name: "Liquid Methane (CH4)", mass: 424, price: 15, stock: 10000 },
		{ name: "Proteins", mass: 3500, price: 10, stock: 0 },
		{ name: "People", mass: 1500, price: 40, stock: planets["uranus"].population },
		{ name: "Sugars (C6H12O6)", mass: 2000, price: 10, stock: 0 },
		{ name: "Sulphuric Acid (H2SO4)", mass: 1826, price: 1, stock: 0 },
		{ name: "Water (H2O)", mass: 1000, price: 10, stock: 100 },
	],
	neptune: [
		// neptune: ["water", "air", "acid", "methane"],
		{ name: "Air (N2 + O2 + CO2)", mass: 870, price: 7, stock: 100 },
		{ name: "Iron (Fe)", mass: 7873, price: 100, stock: 0 },
		{ name: "Liquid Methane (CH4)", mass: 424, price: 20, stock: 10000 },
		{ name: "Proteins", mass: 3500, price: 30, stock: 0 },
		{ name: "People", mass: 1500, price: 50, stock: planets["neptune"].population },
		{ name: "Sugars (C6H12O6)", mass: 2000, price: 15, stock: 0 },
		{ name: "Sulphuric Acid (H2SO4)", mass: 1826, price: 1, stock: 0 },
		{ name: "Water (H2O)", mass: 1000, price: 15, stock: 100 },
	]
}


express.get('/buyGoods', function (request, response) {
	let planet = request.query.planet;
	response.send(goods[planet]);
});

express.post('/buyGoods', function (request, response) {
	let name = request.body.item;
	let quantity = Number(request.body.quantity);
	let planet = request.body.planet;
	let wealth = Number(request.body.wealth);

	for (let good of goods[planet]) {
		if (good.name == name) {
			if (quantity * good.price > wealth) {
				return response.send({ message: "Transaction Declined" });
			}
			// You can't sell more than exists.
			if (good.stock > quantity) {
				good.stock -= quantity;
			} else {
				quantity = good.stock;
				good.stock = 0;
			}

			planets[planet].wealth += quantity * good.price;

			// Return what is going into the users inventory.
			return response.send({
				name: good.name,
				price: good.price,
				mass: good.mass,
				stock: quantity
			});
		}
	}
});

express.post('/sellGoods', function (request, response) {
	let name = request.body.item;
	let quantity = Number(request.body.quantity);
	let planet = request.body.planet;
	for (let good of goods[planet]) {
		if (good.name == name) {
			// You can't sell more than the available wealth.
			if (good.price * quantity > planets[planet].wealth) {
				return response.send({
					message: "Planet has insufficient wealth to purchase those goods"
				});
			} else {
				planets[planet].wealth -= quantity * good.price;

				// Return what is going into the users inventory.
				return response.send({
					name: good.name,
					price: good.price,
					mass: good.mass,
					stock: quantity
				});
			}
		}
	}
});

// Chat Section
const chatMessages = []
express.post('/chat', function (request, response) {
	chatMessages.push(`${request.body.accountName}: ${request.body.chatIn}`);
	response.send({ success: true });
	if (chatMessages.length > 20) {
		chatMessages.splice(0, 20 - chatMessages.length);
	}
});

express.get('/chat', function (request, response) {
	response.send(chatMessages);
});

express.get('/population', function (request, response) {
	let planet = request.query.planet;
	planet = Object.assign({}, planets[planet]);
	delete planet.players;
	return response.send({ planet: planet });
});


const ships = {
	// '2zk2jfgl8ngfd5wsvwnaph':
	// {
	// 	accId: '2zk2jfgl8ngfd5wsvwnaph',
	// 	position:
	// 	{
	// 		top: '528299.9534089267px',
	// 		left: '945550.6731114537px',
	// 		angle: '0.33161255787892263',
	// 		velocity: '6'
	// 	}
	// }
};

setInterval(() => {
	for (let ship in ships) {

	}
}, 60000);

express.post('/updatePosition', function (request, response) {
	let accId = request.body.accId;
	if (undefined == ships[accId]) ships[accId] = {};

	let me = ships[accId];
	// Push the whole update into the ships position information.
	ships[accId] = Object.assign(ships[accId], request.body);
	// Save the time of the last update - So we can effect ships in space.
	me.time = new Date().getTime();

	// Respond with all of the positions of ships that are close to mine (within 10K?)
	let notify = [];
	let ship: any;
	for (let id in ships) {
		ship = ships[id];
		// Don't tell me about myself.
		if (ship.accId == accId) continue;

		let dist = Number(Math.sqrt(((Number(me.position.top) - Number(ship.position.top)) ** 2) + ((Number(me.position.left) - Number(ship.position.left)) ** 2)).toFixed(0));
		// Notify if a ship is within 5K radius
		// !CONFIG
		if (dist < 5000) {
			notify.push(ship.position);
		}
	}

	let event = getEvents(accId);

	response.send({ success: true, notify, event });
});

const events = {};
function getEvents(accId) {
	// Clone the event so we can clear the memory.
	let e = Object.assign({}, events[accId]);

	// Clean up the memory, this has been delivered.
	delete events[accId];

	// Return the event.
	return e;
}

function loopCreateEvent() {
	setTimeout(() => {
		createEvent();
	}, Math.min(60 * 1000, (Math.random() * 10 * 60 * 1000)));
}

function createEvent() {
	let events = [solarFlare, meteors, pirates];

	let event = Math.abs(Math.random() * events.length).toFixed(0);

	events[event]();

	loopCreateEvent();
}

// Create a game event
function solarFlare() {
	console.log("Event solarFlare");

	let eventTime = Math.min(60 * 1000, (Math.random() * 3 * 60 * 1000));
	// TODO: Come back to the idea of pushing craft away form the sun based on the energy of the eruption.
	// 1 erg/s	1.0E-7 W
	// 10**27 ergs
	// let eventEnergy = ((Math.random()*10) + 22) * 1.0e-7;

	chatMessages.push(`MERCURY EARLY WARNING: Solar Event Detected - Seek Shelter on Planet (ETA: ${(eventTime / 1000).toFixed(0)}sec)`);
	setTimeout(() => {
		// Things that happen.
		// Lose a random amount of your cargo
		// Get accelerated away from the sun (direct vector, pushed by the solar wind)

		let now = new Date().getTime() - 1000;

		let ship: any;
		for (let id in ships) {
			ship = ships[id];

			if (ship.time > now) {
				if (undefined == events[ship.accId]) events[ship.accId] = {};
				let evt = events[ship.accId];
				evt.name = "solarFlare";
				evt.message = "You have been hit by a Solar Flare, Cargo and Velocity may have been changed.";
				evt.cargo = Number((Math.random() * 20).toFixed(0)) / 100;
				// evt.force = 
			}
		}
	}, eventTime);
}

// Create a game event
function meteors() {
	console.log("Event meteors");
	console.log("Not yet implemented");
}

// Create a game event
function pirates() {
	console.log("Event pirates");
	console.log("Not yet implemented");
}

// Engines make you consume less fuel
// Steering makes it quicker to turn.
// sensors makes it so you can see more (zoom out)
const upgrades = {
	mercury: [
		{ name: "Attitude Control", cost: 4, mass: 7873 / 10 }
	],
	venus: [
		{ name: "Sensors", cost: 10, mass: 7873 / 10 }
	],
	earth: [
		{ name: "Engines", cost: 8, mass: 7873 / 3 }
	],
	mars: [
		{ name: "Attitude Control", cost: 5, mass: 7873 / 9 }
	],
	uranus: [
		{ name: "Engines", cost: 3, mass: 7873 / 5 }
	],
	neptune: [
		{ name: "Sensors", cost: 10, mass: 7873 / 10 }
	]
}
express.get('/getUpgradeList', function (request, response) {
	let planet = request.query.planet;
	response.send(upgrades[planet]);
});

express.post('/upgradeShip', function (request, response) {
	let level = Number(request.body.level);
	// let part = request.body.part;
	let quantity = Number(request.body.quantity);
	let wealth = Number(request.body.wealth);
	let planet = request.body.planet;

	if (quantity > 0) {
		let cost = upgrades[planet][0].cost * level;
		if (wealth > cost) {
			// Can afford to buy
			response.send({
				success: true,
				message: 'Transaction Successful',
				wealth: -cost,
				level: level + 1
			});
		} else {
			response.send({ message: "Insufficient Wealth" });
		}
	} else {
		let cost = upgrades[planet][0].cost * (level - 1);
		if (planets[planet].wealth > cost) {
			// Planet can afford to buy
			response.send({
				success: true,
				message: 'Transaction Successful',
				wealth: cost,
				level: level - 1
			});
		} else {
			response.send({ message: "Insufficient Wealth" });
		}
	}
});

express.post('/updateCity', function (request, response) {
	let accId = request.body.accId;
	let planet = request.body.planet;
	let city = request.body.city;

	let pay: number = Number(request.body.pay);

	planet = planets[planet];
	planet.wealth += pay;

	// Use this later, City's can sell to the capital, and the capital can sell to the captains.
	// Capital also buys from Captains, so it can sell to the Cities

	// if (undefined == planet.players[accId]) {
	// 	planet.players[accId] = city;
	// 	planet.air += Number(city.goods[0].stock);
	// 	planet.population += Number(city.goods[4].stock);
	// 	planet.protine += Number(city.goods[3].stock);
	// 	planet.sugars += Number(city.goods[5].stock);
	// 	planet.water += Number(city.goods[7].stock);
	// 	planet.wealth += Number(city.wealth);
	// } else {
	// 	planet.air -= Number(planet.players[accId].goods[0].stock);
	// 	planet.air += Number(city.goods[0].stock);

	// 	planet.population -= Number(planet.players[accId].goods[4].stock);
	// 	planet.population += Number(city.goods[4].stock);

	// 	planet.protine -= Number(planet.players[accId].goods[3].stock);
	// 	planet.protine += Number(city.goods[3].stock);

	// 	planet.sugars -= Number(planet.players[accId].goods[5].stock);
	// 	planet.sugars += Number(city.goods[5].stock);

	// 	planet.water -= Number(planet.players[accId].goods[7].stock);
	// 	planet.water += Number(city.goods[7].stock);

	// 	planet.wealth -= Number(planet.players[accId].wealth);
	// 	planet.wealth += Number(city.wealth);
	// }

	planet.players[accId] = city;

	response.send({ success: true });
});

const port = 80;
express.listen(
	port,
	() => { console.log(`Listening on 0.0.0.0:${port}`) }
);