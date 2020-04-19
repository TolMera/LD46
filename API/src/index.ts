let users = [];
let orders: Array<{to: string, type: string, quantity: number, price: number}> = [
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
	{to: "mars", type: "acids", quantity: 100, price: 1},
];

let EXPRESS = require('express');
let CORS = require('cors');
let COMPRESSION = require('compression');
let PATH = require('path');;

const express = EXPRESS();

express.use(CORS());
express.use(COMPRESSION());

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
		console.log(request)
		response.sendFile(PATH.join(__dirname + `/../../GUI/Music/${file}`));
	});
}

for (let file of ["ship1.png", "arrow.png"]) {
	express.get(`/Art/${file}`, function (request, response) {
		console.log(request)
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

express.get('/orders', function(request, response) {
	response.send(orders);
});

express.post('/orders', function(request, response) {
	console.log(request);
});

const port = 80;
express.listen(
	port,
	() => { console.log(`Example app listening at http://localhost:${port}`) }
);