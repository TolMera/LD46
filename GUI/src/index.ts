class game {
	backgroundUrl: string;
	url: { server: string; };
	planets: any;
	api: any;
	_zoom: any = 20;
	distances: number = 1536;
	acceleration: number = 100;
	accountId: string;
	zoomTo: string = "sun";
	musicList: Array<string> = [];
	musicTrack: number = 0;

	// Player status information
	docked: boolean = true;
	soundElem: any;
	resource: any;
	shipView: NodeJS.Timeout;
	shipCompas: NodeJS.Timeout;
	navTarget: any;

	planet: any = {
		wealth: 0,
		goods: [
			{ name: "Air (N2 + O2 + CO2)", mass: 870, price: 10, stock: 100 },
			{ name: "Iron (Fe)", mass: 7873, price: 10, stock: 0 },
			{ name: "Liquid Methane (CH4)", mass: 424, price: 0, stock: 0 },
			{ name: "Proteins", mass: 3500, price: 10, stock: 100 },
			{ name: "People", mass: 1500, price: 20, stock: 100 },
			{ name: "Sugars (C6H12O6)", mass: 2000, price: 2, stock: 100 },
			{ name: "Sulphuric Acid (H2SO4)", mass: 1826, price: 0, stock: 0 },
			{ name: "Water (H2O)", mass: 1000, price: 40, stock: 100 },
		],
		buildings: {
			water: {
				name: "Water (H2O)",
				shortName: "Water",
				index: 7,
				level: 0
			},
			air: {
				name: "Air (N2 + O2 + CO2)",
				shortName: "Air",
				index: 0,
				level: 0
			},
			acid: {
				name: "Sulphuric Acid (H2SO4)",
				shortName: "Acid",
				index: 6,
				level: 0
			},
			iron: {
				name: "Iron (Fe)",
				shortName: "Iron",
				index: 1,
				level: 0
			},
			methane: {
				name: "Liquid Methane (CH4)",
				shortName: "Methane",
				index: 2,
				level: 0
			},
			protein: {
				name: "Proteins",
				shortName: "Protein",
				index: 3,
				level: 0
			},
			sugar: {
				name: "Sugars (C6H12O6)",
				shortName: "Sugar",
				index: 5,
				level: 0
			},
		}
	}

	ship: any = {
		rotation: 0,
		velocity: 0,
		capacity: 200,
		cargo: {
			"Air (N2 + O2 + CO2)": { stock: 0 },
			"Iron (Fe)": { stock: 0 },
			"Liquid Methane (CH4)": { stock: 100 },
			"Proteins": { stock: 0 },
			"People": { stock: 0 },
			"Sugars (C6H12O6)": { stock: 0 },
			"Sulphuric Acid (H2SO4)": { stock: 0 },
			"Water (H2O)": { stock: 0 },
		},
		// Starting mass of the ship... Just an arbitraru number at this point.
		mass: 10 * 7873,
		wealth: 100,

		"Attitude Control": {
			value: 1,
		},
		"Engines": {
			value: 1,
		},
		"Sensors": {
			value: 1,
		},
	};
	shipDockingTimer: NodeJS.Timeout;
	accountName: string;

	chatMessages = [];
	updateServerInterval: number = 10;
	navUpdateTimer: number = 10000;
	career: string;

	pay: number = 0;

	volume = 0.25;

	MathAccelleration(force, mass) { return force / mass }
	MathMass(acceleration, force) { return force / acceleration }
	MathForce(acceleration, mass) { return acceleration * mass }


	goodsLookup: any = {
		"Iron (Fe)": {
			name: "Iron (Fe)",
			shortName: "Iron",
			index: 1,
			mass: 7873
		},
		"Liquid Methane (CH4)": {
			name: "Liquid Methane (CH4)",
			shortName: "Methane",
			index: 2,
			mass: 424,
			stock: 1000,
			energy: 5888,
			force: 600480
		},
		"Sulphuric Acid (H2SO4)": {
			name: "Sulphuric Acid (H2SO4)",
			shortName: "Acid",
			index: 6,
			mass: 1826
		},
		"Water (H2O)": {
			name: "Water (H2O)",
			shortName: "Water",
			index: 7,
			mass: 1000
		},
		"Air (N2 + O2 + CO2)": {
			name: "Air (N2 + O2 + CO2)",
			shortName: "Air",
			index: 0,
			mass: 870
		},
		"People": {
			name: "People",
			shortName: "Population",
			index: 4,
			mass: 1500
		},
		"Proteins": {
			name: "Proteins",
			shortName: "Protein",
			index: 3,
			mass: 3500
		},
		"Sugars (C6H12O6)": {
			name: "Sugars (C6H12O6)",
			shortName: "Sugar",
			index: 5,
			mass: 2000
		},
	}

	planetLookup: any = {
		mercury: {
			factories: ["air", "iron", "methane", "protein", "sugar"]
		},
		venus: {
			factories: ["water", "air", "acid", "methane"]
		},
		earth: {
			factories: ["water", "air", "acid", "iron", "methane", "protein", "sugar"]
		},
		mars: {
			factories: ["air", "iron", "methane", "sugar"]
		},
		uranus: {
			factories: ["water", "air", "acid", "methane"]
		},
		neptune: {
			factories: ["water", "air", "acid", "methane"]
		},
	}

	factoryLookup: any = {
		Water: {
			name: "Water",
			longName: "Water (H2O)",
			cost: 10,
			production: 1,
			uses: [],
			product: "Water",
		},
		Air: {
			name: "Air",
			longName: "Air (N2 + O2 + CO2)",
			cost: 10,
			production: 1,
			uses: ["Water"],
			product: "Air",
		},
		Acid: {
			name: "Acid",
			longName: "Sulphuric Acid (H2SO4)",
			cost: 10,
			production: 1,
			uses: [],
			product: "Acid",
		},
		Iron: {
			name: "Iron",
			longName: "Iron (Fe)",
			cost: 10,
			production: 1,
			uses: ["Acid"],
			product: "Iron",
		},
		Methane: {
			name: "Methane",
			longName: "Liquid Methane (CH4)",
			cost: 10,
			production: 1,
			uses: ["Air", "Sugar"],
			product: "Methane",
		},
		Protein: {
			name: "Protein",
			longName: "Proteins",
			cost: 10,
			production: 1,
			uses: ["Air", "Sugar", "Water"],
			product: "Protein",
		},
		Sugar: {
			name: "Sugar",
			longName: "Sugars (C6H12O6)",
			cost: 10,
			production: 1,
			uses: ["Air", "Water", "Iron"],
			product: "Sugar",
		},
	}

	constructor() {
		console.log("Starting Game Constructor");

		this.backgroundUrl = "Planets/Textures/stars.jpg";

		this.url = {
			// server: "ld46-792073873.ap-southeast-2.elb.amazonaws.com"
			server: "ec2-13-211-6-45.ap-southeast-2.compute.amazonaws.com"
			// server: "127.0.0.1"
		}

		this.resource = {
			myShip: "Art/ship1.png",
			arrow: "Art/arrow.png",
		};

		this.planets = {
			sun: {
				radius: 695700,
				year: 0,
				// Had to nurf the ratio because the sun was swallowing Mercury
				// ratio: 1,
				ratio: .5,
				auRatio: 0,
				img: `Planets/sphere/sun.png`,
				texture: `Planets/Textures/sun.jpg`,
				flavorText: "The Sun is well known for it's incredible HotPot.",
				zoom: 900
			},
			mercury: {
				radius: 2439,
				year: 1,
				ratio: 0.0035,
				auRatio: 0.012,
				img: `Planets/sphere/mercury.png`,
				texture: `Planets/Textures/mercury.jpg`,
				flavorText: "Mercury is in a tidal lock with the Sun, meaning that one face is always to the sun, same as the Earths moon only ever shows one side to the earth. This has led to a unique growing environment for foods, which are cultivated in the sunset ring, on the edge of day and night.  An abundance of solar energe has made this world an exporter of all kinds of raw elements.  Especially Alumnimum which requires vast amounts of energy to refine.",
				zoom: 900
			},
			venus: {
				radius: 6051,
				year: 2.55,
				ratio: 0.0086,
				auRatio: 0.024,
				img: `Planets/sphere/venus.png`,
				texture: `Planets/Textures/venus.jpg`,
				flavorText: "Since it's impossible to reach the surface of Venus, all the cities here are built around giant inflated bladders, keeping the city aloft in the high atmosphere of Venus. The unparalelled views are equaled only by the fine dining experiences to be had.  This is a tourist hotspot, and a good source of Sulphuric Acid and other gassius compounds.",
				zoom: 900
			},
			earth: {
				radius: 6051,
				year: 4.14,
				ratio: 0.0091,
				auRatio: 0.033,
				img: `Planets/sphere/earth.png`,
				texture: `Planets/Textures/earth.jpg`,
				flavorText: "Earth used to be the only habbitable world, hoever that changed when humanity set foot in the stars.  Now Earth is a land of riches, the early days of space exploration were kind to investors on Earth, and all major industry was moved off planet.  Lush and peaceful this world now boasts little export, but thrives regardless from the investments made in the early days of space.  Many tourists depart from earth to spend their fortune throughout the solar system.",
				zoom: 900
			},
			mars: {
				radius: 3396,
				year: 7.8,
				ratio: 0.0048,
				auRatio: 0.050,
				img: `Planets/sphere/mars.png`,
				texture: `Planets/Textures/mars.jpg`,
				flavorText: "Mars has always been the Red Planet.  That red colour comes from high concentrations of Iron oxides in the planets crust.  So much in fact, that Iron can be collected as nuggets right off the planets surface.  An absolute abundance of metal ores is helping Mars to build an export economy speciallising in ore, and once refined, it's shipped back to Mars for further manufacturing into equipment for all industries (especially space exploration).",
				zoom: 900
			},
			jupiter: {
				radius: 71492,
				year: 49,
				ratio: 0.1027,
				auRatio: 0.173,
				img: `Planets/sphere/jupiter.png`,
				texture: `Planets/Textures/jupiter.jpg`,
				flavorText: "Jupiter is a Gas Giant, it's impossible to land here, but science and humanity have taken great interest in Jupiter.  Space stations orbit this Gas Giant conductin all manner of research, with stellar views and a long journey for investigators and journalists, Jupiter is the perfect place for Labs to experiment with the more 'unusual' sciences.",
				zoom: 900
			},
			saturn: {
				radius: 60268,
				year: 120,
				ratio: 0.0866,
				auRatio: 0.318,
				img: `Planets/sphere/saturn.png`,
				texture: `Planets/Textures/saturn.jpg`,
				flavorText: "Saturn became \"The place\" for weddings when an ice meteor was captured by the gravity of Saturn, making Saturn look like it's wearing a Gigantic Diamond!  What better way to win a womans heart than dragging her to the farthest reaches of human civilisation.  There's nothing out here except for Tourists and small businesses that cater to them.  A good trade in Flowers and food is to be had at this far reach of the solar system.",
				zoom: 900
			},
			uranus: {
				radius: 25559,
				year: 348.40,
				ratio: 0.0367,
				auRatio: 0.638,
				img: `Planets/sphere/uranus.png`,
				texture: `Planets/Textures/uranus.jpg`,
				flavorText: "Noone visits Uranus, the jokes are far too much for any person to bare for the extremely long journey.  The few people to be found out this far, are normally on the run, or are turning a high profit from those on the run.  While there is money to be made, there's also a risk of losing your life or your ship!",
				zoom: 900
			},
			neptune: {
				radius: 24764,
				year: 684.37,
				ratio: 0.0355,
				auRatio: 1,
				img: `Planets/sphere/neptune.png`,
				texture: `Planets/Textures/neptune.jpg`,
				flavorText: "Neptune is the furthers that Humanity has travelled.  Out this far there are only a few Science stations and listening posts.  In the hope of making contact with Aliens and number of new religions exist out this far, mainly founded by Scientists who have found the pressure of working so far from the rest of humanity to be too much.  Little money is to be made comming here, but leaving and going back into the solar system will yield a high reward for those who can make the trip.",
				zoom: 900
			},
		}

		// Setup the game screen - Background etc
		this.background();

		gameScreenDraw: {
			setInterval(() => { this.zoom = this.zoom }, 1000 / 30);
		}

		this.showMenu();

		music: {
			// Best to worst
			this.musicList.push("Music/BeepBoxSong7.mp3");
			this.musicList.push("Music/BeepBoxSong3.mp3");
			this.musicList.push("Music/BeepBoxSong5.mp3");
			this.musicList.push("Music/BeepBoxSong4.mp3");
			this.musicList.push("Music/BeepBoxSong1.mp3");
			this.musicList.push("Music/BeepBoxSong6.mp3");
			this.musicList.push("Music/BeepBoxSong2.mp3");

			$('body').one("click", () => {
				this.jBeep(this.musicList[0]);
			});
		}

		shipInfo: {
			setInterval(() => {
				$('#rotation').text(`Rotation: ${this.ship.rotation.toFixed(2)}`);
				$('#velocity').text(`Velocity: ${this.ship.velocity}`);
				$('#mass').text(`Mass: ${this.ship.mass.toFixed(2)}`);
				$('#fuel').text(`Fuel: ${this.ship.cargo["Liquid Methane (CH4)"].stock.toFixed(2)}`);
				$('#wealth').text(`Wealth: ${this.ship.wealth.toFixed(2)}`);
				$('#cargoCap').text(`Cargo max: ${this.ship.capacity.toFixed(2)}`);
				$('#cargoNow').text(`Cargo Space: ${this.getCargoNow().toFixed(2)}`);
			}, 1000);
		}

		chat: {
			setInterval(this.getChat.bind(this), 5000);
		}
	}

	getCargoNow() {
		let cap = this.ship.capacity;
		for (let item in this.ship.cargo) {
			cap -= this.ship.cargo[item].stock;
		}
		return cap;
	}

	get zoom() {
		return this._zoom;
	}
	set zoom(value) {
		if (this._zoom != value) {
			this._zoom = value;
			this.getPlanets().then((positions) => {
				let sun;
				for (let index in this.planets) {
					let planet = this.planets[index];
					let stats: any = this.measure();
					if ("sun" == index) {
						// Create the sun in the center of the screen.
						sun = $('#' + index).css({
							top: `${((50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10)}px`,
							left: `${((50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10)}px`,
							height: `${this.zoom * planet.ratio}cm`,
							width: `${this.zoom * planet.ratio}cm`,
						}).css(["height", "width"]);

						sun.top = ((50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10);
						sun.left = ((50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10);
						sun.height = this.zoom * planet.ratio;
						sun.width = this.zoom * planet.ratio;

					} else {
						$('#' + index).css({
							top: `${(Number(+sun.top) + (Number(sun.height) / 2) - (this.zoom * planet.ratio / 2) + (Math.cos(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
							left: `${(Number(+sun.left) + (Number(sun.width) / 2) - (this.zoom * planet.ratio / 2) + (Math.sin(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
							height: `${this.zoom * planet.ratio}cm`,
							width: `${this.zoom * planet.ratio}cm`,
						});
					}
				}
			});
		} else {
			this.getPlanets().then((positions) => {
				let sun: any;
				for (let index in this.planets) {
					let planet = this.planets[index];
					let stats: any = this.measure();
					if ("sun" == index) {

						// Create the sun in the center of the screen.
						sun = $('#' + index)
							.css({
								top: `${((50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10)}px`,
								left: `${((50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10)}px`,
							}).css(["height", "width"]);

						sun.top = ((50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10);
						sun.left = ((50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10);
						sun.height = this.zoom * planet.ratio;
						sun.width = this.zoom * planet.ratio;

						if (index == this.zoomTo) {
							$('#gameMap').css({
								top: `-${+sun.top - ((stats.height * 50) - (sun.height / 2))}px`,
								left: `-${+sun.left - ((stats.width * 50) - (sun.width / 2))}px`,
							});
						}
					} else {
						$('#' + index).animate({
							top: `${(Number(+sun.top) + (Number(sun.height) / 2) - (this.zoom * planet.ratio / 2) + (Math.cos(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
							left: `${(Number(+sun.left) + (Number(sun.width) / 2) - (this.zoom * planet.ratio / 2) + (Math.sin(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
						}, /* !CONFIG */ 1000 / 1, "linear");
						let dimensions: any = $('#' + index).css(["top", "left", "height", "width"]);

						// Get the top and left of the sun so we can offset from the point + half the suns height/width
						for (let key in dimensions) {
							dimensions[key] = Number(dimensions[key].replace(/px/gi, '')).toFixed(10);
						}

						if (index == this.zoomTo) {
							$('#gameMap').css({
								top: `-${+dimensions.top - ((stats.height * 50) - (dimensions.height / 2))}px`,
								left: `-${+dimensions.left - ((stats.width * 50) - (dimensions.width / 2))}px`,
							});
						}
					}
				}
			});
		}
	}

	// Connects to the game server and starts actually playing the game
	async joinUniverse() {
		console.log("78fb65e1-69ad-5fea-ac30-407e8aec05a4");
		$('#joinLink').attr('disabled', 'true');
		$('#menu').remove();

		this.showLogin();
	}

	// Takes you to a tutorial - Most likely a YouTube video
	async tutorial() {
		let menu = this.createMenu();

		createHeading: {
			menu.append($.parseHTML(`<h1>TL;DR;</h1>
			<h2>Captain</h2>
			<p>Buy cargo - Take that cargo to another planet, turn a profit when you sell it.<br />
			<br/>
			Watch the chat for planets that need a particular resource.  You might find it's cheaper to run a small cargo than a huge one.<br />
			<br />
			Click the planet name on the top right to get a navigation heading (Upgrades increase the resolution of your navigation system).<br />
			<br />
			Watch the details on the Top Left of the screen, this tells you all about your ship and what's going on.
			</p>
			<h2>Governor</h2>
			<p>
			Governors supply the needs of their inhabitants by upgrading factories to produce resources both for consumption and for export.  Governors need Captains to bring the resources that their colony can not produce.  It's a diplomatic position and you need to share with the other colonies on the same planet as you.<br />
			<br />
			Buying and selling happens with the planets global market.  When you sell goods into the market, other colonies on the planet can buy those resources, and captains can export those resources for you.  When a Captain brings resources to the planet, they sell them into the planets global market, so you'll need to get what you need and share with the other colonies on the planet.
			</p>
			
			<h1>Elon-zo Tutorial</h1>
			<h2>Elon-zo was created for Ludum Dare 46, in 72 hours by Bjorn "TolMera" Macintosh.</h2>
			<p>
			This game is Multiplayer and is best played with a group of friends who can work together.  You will be playing with anyone else who has joined the server as well, so be nice and use the chat feature to communicate with the Captains and Governors in the solar system.<br />
			<br />
			<h3>Governor</h3>
			There are two games in this package, the first is a colony simulation game keeping in touch with the LD46 Theme, you need to balance the resources that your colony is producing and consuming so that you don't run out of Air, Water, Sugar or Protein.  These are the basics of life, and you're going to need to keep supplying them for your growing population.  But keep in mind, this is a network game and you're on a hostile foreign planet (unless you chose Earth as your colony location).<br />
			<br />
			Since this is a Network game, to fully take advantage of this, you're going to need to communicate with the Captains who are running shipments of cargo between all the planets in the solar system.  If the planet you're on can't provide you with water, you're going to need to entice the Captains to visit your planet with a shipment of water. So make sure you keep an eye on the chat.<br />
			<br />
			From your city you can build different factories, these factories consume and produce resources (description is on each factory).  When you have produced something that your colony is not consuming, you can sell that resource to the Planitary Market where Captains can come to your planet, and purchase the good that you have produced.  This is how you get more money into your economy (export).  Captains will also bring things to your planet that you need, such as Water on Mars (Import) This can be expensive and will draw money out of your economy.  Ultimately you want to trade with the captains balancing import and export so you can grow your colony and make sure that someone is bringing you that valuable Air to breath.<br />
			<br />
			</p>
			<h3>Captain</h3>
			<p>Captains pilot great ships between the planets in the solar system.  On different planets in the solar system there are upgrades for the Captains ship, you should pay close attention to the upgrades, they are not all equal.<br />
			<br />
			Captains have a simple job but it's difficult to balance the needs of so many planets full of people who need your services.  Take resources from one planet to another planet, turn a profit and upgrade your ship.  That's the basics of what it means to be a captain, but you also have the power to see your favourit planet succeed and to crush the hopes of other planets through economic warfare.  It's up to you as the Captain.
			</p>`));
			// $('#heading').text("Welcome to Elon-zo").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}
	}

	// Will be a link to the Wiki or similar things
	async wiki() {
		this.message("Feature under development - c94bf69f-764f-58a9-a9e9-4ba43e831dea");
		console.log("Feature under development", "d03360d8-e0f5-5865-8703-955033659a56");
	}

	// Shows the game menu
	async showMenu() {
		console.log("220e5b2d-87a4-521f-b1e6-aeac2cc17017");
		let menu = this.createMenu();

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text("Welcome to Elon-zo").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		createJoinButton: {
			let joinUniverse = document.createElement('button');
			joinUniverse.setAttribute("id", "joinLink");
			joinUniverse.setAttribute('onclick', 'game.joinUniverse()');
			menu.append(joinUniverse);

			let joinLink = $('#joinLink');
			joinLink.text("Join Universe");
			joinLink.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		createTutorialButton: {
			let tutorial = document.createElement('button');
			tutorial.setAttribute("id", "tutorialButton");
			tutorial.setAttribute('onclick', 'game.tutorial()');
			menu.append(tutorial);

			let tutorialButton = $('#tutorialButton');
			tutorialButton.text("Tutorial");
			tutorialButton.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		createWikiButton: {
			let wiki = document.createElement('button');
			wiki.setAttribute("id", "wikiButton");
			wiki.setAttribute('onclick', 'game.wiki()');
			menu.append(wiki);

			let wikiButton = $('#wikiButton');
			wikiButton.text("Read the Wiki");
			wikiButton.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}
	}

	async showLogin() {
		console.log("84c7514d-7519-53bc-8394-d835beb351d3");
		let menu = this.createMenu();

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text("Login or start a new adventure").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });

			let p = document.createElement('p');
			p.setAttribute("id", "paragraph")
			menu.append(p);
			$('#paragraph').text("Below is your account ID, save it so you can log back in, or insert your previous ID to login again.").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		createAccountName: {
			menu.append($.parseHTML('<p id="acctNameLabel" for="acctName">Username</p><input type="text" id="acctName">'));

			$('#acctNameLabel').css({
				border: "3px solid goldenrod",
				// height: "1.25cm",
				width: "23%",
				"font-size": "1.5em",
				margin: "3px 0px",
			});

			let acctText = $('#acctName');
			acctText.val("Username");
			acctText.css({
				border: "3px solid goldenrod",
				"background-color": "RGBA(25, 25, 25, 0.75)",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		createAccountToken: {
			menu.append($.parseHTML('<p id="acctInputLabel" for="acctInput">Acct Key</p><input type="text" id="acctInput">'));
			$('#acctInputLabel').css({
				border: "3px solid goldenrod",
				// height: "1.25cm",
				width: "23%",
				"font-size": "1.5em",
				margin: "3px 0px",
			});

			let acctText = $('#acctInput');
			acctText.val(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
			acctText.css({
				border: "3px solid goldenrod",
				"background-color": "RGBA(25, 25, 25, 0.75)",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		createJoinButton: {
			let login = document.createElement('button');
			login.setAttribute("id", "loginButton");
			login.setAttribute('onclick', 'game.login()');
			menu.append(login);

			let loginButton = $('#loginButton');
			loginButton.text("Login");
			loginButton.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}
	}

	async login() {
		console.log("eb721136-fbf4-53ad-babe-66a049c058b6");
		this.accountId = $('#acctInput').val().toString();
		this.accountName = $('#acctName').val().toString();

		$('#menu').remove();
		console.log("Loading account information - 6a576171-eba0-57a5-904c-462a22a2df2e");

		let prom = new Promise((resolve, reject) => {
			$.getJSON(
				"login",
				{
					accountId: this.accountId,
					accountName: this.accountName,
				},
				resolve
			)
		}).then((data: any) => {
			console.log(data);
			if (true == data.isNew) {
				this.showCareers();
			} else {
				//  More complicated load function, we now have to restore the player to where they were, or maybe we say that they can only save if they are on a planet?  Otherwise career over?  (Don't get stuck hanging out in space a...)
				this.resumeCareer(data);
			}
		}).catch((err) => {
			console.log("177b0355-3289-509a-95c3-b18897ae2277");
			this.message('error in console');
			console.error(err);
		});

		return prom;
	}

	async resumeCareer(data) {
		this.message("Not yet implemented");
	}

	async showCareers() {
		console.log("9bfcd670-8d11-5927-9c11-5dc8c5998b94");
		let menu = this.createMenu();

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text("Select your Career path").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });

			let p = document.createElement('p');
			p.setAttribute("id", "paragraph")
			menu.append(p);
			$('#paragraph').text("Are you a Governor, or are you a Captain?").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		createButton1: {
			let button1 = document.createElement('button');
			button1.setAttribute("id", "liveButton1");
			button1.setAttribute('onclick', 'game.startGovernor()');
			menu.append(button1);

			let liveButton1 = $('#liveButton1');
			liveButton1.text("I'm a Governor");
			liveButton1.css({
				border: "3px solid goldenrod",

				height: "50%",
				width: "49%",
				margin: "3px 3px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		createButton2: {
			let button2 = document.createElement('button');
			button2.setAttribute("id", "liveButton2");
			button2.setAttribute('onclick', 'game.startCaptain()');
			menu.append(button2);

			let liveButton2 = $('#liveButton2');
			liveButton2.text("I'm a Captain");
			liveButton2.css({
				border: "3px solid goldenrod",

				height: "50%",
				width: "49%",
				margin: "3px 3px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}
	}

	async startGovernor() {
		console.log("a0aeba05-01ec-5d42-ac0b-a55ae9967db6");

		this.depopShip();

		// Would be good to play a sound here that is City founding esk
		let menu = this.createMenu();

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text("On what world do you wish to settle?").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		Mercury: {
			let button = document.createElement('button');
			button.setAttribute("id", "mercuryButton");
			button.setAttribute('onclick', 'game.newCity("mercury")');
			menu.append(button);

			let buttonLive = $('#mercuryButton');
			buttonLive.text("Mercury");
			buttonLive.css({

				height: "1cm",
				width: "100%",

				"font-size": "1.5em",
			});
		}

		Venus: {
			let button = document.createElement('button');
			button.setAttribute("id", "venusButton");
			button.setAttribute('onclick', 'game.newCity("venus")');
			menu.append(button);

			let buttonLive = $('#venusButton');
			buttonLive.text("Venus");
			buttonLive.css({

				height: "1cm",
				width: "100%",

				"font-size": "1.5em",
			});
		}

		Earth: {
			let button = document.createElement('button');
			button.setAttribute("id", "earthButton");
			button.setAttribute('onclick', 'game.newCity("earth")');
			menu.append(button);

			let buttonLive = $('#earthButton');
			buttonLive.text("Earth");
			buttonLive.css({

				height: "1cm",
				width: "100%",

				"font-size": "1.5em",
			});
		}

		Mars: {
			let button = document.createElement('button');
			button.setAttribute("id", "marsButton");
			button.setAttribute('onclick', 'game.newCity("mars")');
			menu.append(button);

			let buttonLive = $('#marsButton');
			buttonLive.text("Mars");
			buttonLive.css({

				height: "1cm",
				width: "100%",

				"font-size": "1.5em",
			});
		}
	}

	async depopShip() {
		Object.assign(this.ship, {
			rotation: 0,
			velocity: 0,
			capacity: 200,
			cargo: {
				"Air (N2 + O2 + CO2)": { stock: 0 },
				"Iron (Fe)": { stock: 0 },
				"Liquid Methane (CH4)": { stock: 0 },
				"Proteins": { stock: 0 },
				"People": { stock: 0 },
				"Sugars (C6H12O6)": { stock: 0 },
				"Sulphuric Acid (H2SO4)": { stock: 0 },
				"Water (H2O)": { stock: 0 },
			},
			wealth: 0,
		});
		console.log(this.ship);
	}

	async newCity(planet) {
		console.log("d7e34205-0dfb-5aa3-81e5-2ddd4f9d130f");
		let menu = this.createMenu();

		console.log(planet);

		weightCode: {
			this.docked = true;
			this.zoomTo = planet;
			this.zoom = this.planets[planet].zoom
		}

		$('#navigation').remove();
		$('#shipInfo').remove();

		this.settlementMenu(planet);
		this.career = "Governor";

		setInterval(() => {
			this.resourceSink()
			$('.credits').text(this.planet.wealth + ' Credits');
		}, 1000);

		setInterval(() => {
			this.factoryWork();
			this.updateServer();
		}, 5000);
	}

	async settlementMenu(planet) {
		if (undefined == planet) planet = this.zoomTo;
		let menu = this.createMenu();

		// View the terrain, and cover the entire screen, the player is no longer in space.
		$('#menu').css({
			"background-image": `url("${this.planets[planet].texture}")`,
			"background-size": "cover",
			"background-repeat": "repeat",
			"overflow-x": "hidden",
			"overflow-y": "auto",

			width: "100%",
			height: "100%",

			position: "relative",
			margin: "0px 0px",
			padding: "3px 3px",
			top: "0px",
			left: "0px",

			// Text and content
			"align-items": "center",
			color: "goldenrod",
		});

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text(planet.toUpperCase()).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });

			let p = document.createElement('p');
			p.setAttribute("id", "planetDetails")
			menu.append(p);
			setInterval(() => {
				this.getPopulation(planet).then((data: any) => {
					$('#planetDetails').text(`Planet Details: 
					[Population: ${data.planet.population}] ---- 
					[Air: ${data.planet.air}] ---- 
					[Protein: ${data.planet.protein}] ---- 
					[Sugars: ${data.planet.sugars}] ---- 
					[Water: ${data.planet.water}] ---- 
					[Acids: ${data.planet.acids}] ---- 
					[Iron: ${data.planet.iron}] ---- 
					[Methane: ${data.planet.methane}] ---- 
					[Wealth: ${data.planet.wealth}]`).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
				});
			}, 10 * 1000);
			this.getPopulation(planet).then((data: any) => {
				console.log(data);
				$('#planetDetails').text(`Planet Details: 
				[Population: ${data.planet.population}] ---- 
				[Air: ${data.planet.air}] ---- 
				[Protein: ${data.planet.protein}] ---- 
				[Sugars: ${data.planet.sugars}] ---- 
				[Water: ${data.planet.water}] ---- 
				[Acids: ${data.planet.acids}] ---- 
				[Iron: ${data.planet.iron}] ---- 
				[Methane: ${data.planet.methane}] ---- 
				[Wealth: ${data.planet.wealth}]`).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
			});

			p = document.createElement('p');
			p.setAttribute("id", "cityDetails")
			menu.append(p);

			setInterval(() => {
				$('#cityDetails').text(`
					City Details:
					[Population: ${Number(this.planet.goods[4].stock).toFixed(2)}] ---- 
					[Air: ${Number(this.planet.goods[0].stock).toFixed(2)}] ---- 
					[Protein: ${Number(this.planet.goods[3].stock).toFixed(2)}] ---- 
					[Sugars: ${Number(this.planet.goods[5].stock).toFixed(2)}] ---- 
					[Water: ${Number(this.planet.goods[7].stock).toFixed(2)}] ---- 
					[Acids: ${Number(this.planet.goods[6].stock).toFixed(2)}] ---- 
					[Iron: ${Number(this.planet.goods[1].stock).toFixed(2)}] ---- 
					[Methane: ${Number(this.planet.goods[2].stock).toFixed(2)}] ---- 
					[Wealth: ${this.planet.wealth}]
				`).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
			}, 1000);
			$('#cityDetails').text(`
				City Details:
				[Population: ${Number(this.planet.goods[4].stock).toFixed(2)}] ---- 
				[Air: ${Number(this.planet.goods[0].stock).toFixed(2)}] ---- 
				[Protein: ${Number(this.planet.goods[3].stock).toFixed(2)}] ---- 
				[Sugars: ${Number(this.planet.goods[5].stock).toFixed(2)}] ---- 
				[Water: ${Number(this.planet.goods[7].stock).toFixed(2)}] ---- 
				[Acids: ${Number(this.planet.goods[6].stock).toFixed(2)}] ---- 
				[Iron: ${Number(this.planet.goods[1].stock).toFixed(2)}] ---- 
				[Methane: ${Number(this.planet.goods[2].stock).toFixed(2)}] ---- 
				[Wealth: ${this.planet.wealth}]
			`).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });

			p = document.createElement('p');
			p.setAttribute("id", "paragraph")
			menu.append(p);
			$('#paragraph').text(this.planets[planet].flavorText).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		showFactoryIcons: {
			menu.append($.parseHTML(`
				<div>
					${(this.planetLookup[this.zoomTo].factories.includes("water") ? `
					<div class="factory" id="factoryWater" style="width: ${(100 / this.planetLookup[this.zoomTo].factories.length) - 1}%;">
						<h3>Produce Water at this factory</h3><p>requires: A world with water</p>
						<p name="level">Level ${this.planet.buildings["Water".toLowerCase()].level}</p>
						${(this.planet.buildings["Water".toLowerCase()].level < 100 ? `<button onclick="game.levelUp('Water')">Level Up (${(Math.pow(this.planet.buildings["Water".toLowerCase()].level, 2) * this.factoryLookup["Water"].cost)} credits)</button>` : '')}
					</div>` : '')}
					${(this.planetLookup[this.zoomTo].factories.includes("air") ? `
					<div class="factory" id="factoryAir" style="width: ${(100 / this.planetLookup[this.zoomTo].factories.length) - 1}%;">
						<h3>Produce Air at this factory</h3><p>requires: ${this.factoryLookup["Air"].uses.join(" + ")}</p>
						<p name="level">Level ${this.planet.buildings["Air".toLowerCase()].level}</p>
						${(this.planet.buildings["Air".toLowerCase()].level < 100 ? `<button onclick="game.levelUp('Air')">Level Up (${(Math.pow(this.planet.buildings["Air".toLowerCase()].level, 2) * this.factoryLookup["Air"].cost)} credits)</button>` : '')}
					</div>` : '')}
					${(this.planetLookup[this.zoomTo].factories.includes("acid") ? `
					<div class="factory" id="factoryAcid" style="width: ${(100 / this.planetLookup[this.zoomTo].factories.length) - 1}%;">
						<h3>Produce Acid at this factory</h3><p>requires: A world with Atmosphere (prefereably acidic)</p>
						<p name="level">Level ${this.planet.buildings["Acid".toLowerCase()].level}</p>
						${(this.planet.buildings["Acid".toLowerCase()].level < 100 ? `<button onclick="game.levelUp('Acid')">Level Up (${(Math.pow(this.planet.buildings["Acid".toLowerCase()].level, 2) * this.factoryLookup["Acid"].cost)} credits)</button>` : '')}
					</div>` : '')}
					${(this.planetLookup[this.zoomTo].factories.includes("iron") ? `
					<div class="factory" id="factoryIron" style="width: ${(100 / this.planetLookup[this.zoomTo].factories.length) - 1}%;">
						<h3>Produce Iron at this factory</h3><p>requires: ${this.factoryLookup["Iron"].uses.join(" + ")}</p>
						<p name="level">Level ${this.planet.buildings["Iron".toLowerCase()].level}</p>
						${(this.planet.buildings["Iron".toLowerCase()].level < 100 ? `<button onclick="game.levelUp('Iron')">Level Up (${(Math.pow(this.planet.buildings["Iron".toLowerCase()].level, 2) * this.factoryLookup["Iron"].cost)} credits)</button>` : '')}
					</div>` : '')}
					${(this.planetLookup[this.zoomTo].factories.includes("methane") ? `
					<div class="factory" id="factoryMethane" style="width: ${(100 / this.planetLookup[this.zoomTo].factories.length) - 1}%;">
						<h3>Produce Methane at this factory</h3><p>requires: ${this.factoryLookup["Methane"].uses.join(" + ")}</p>
						<p name="level">Level ${this.planet.buildings["Methane".toLowerCase()].level}</p>
						${(this.planet.buildings["Methane".toLowerCase()].level < 100 ? `<button onclick="game.levelUp('Methane')">Level Up (${(Math.pow(this.planet.buildings["Methane".toLowerCase()].level, 2) * this.factoryLookup["Methane"].cost)} credits)</button>` : '')}
					</div>` : '')}
					${(this.planetLookup[this.zoomTo].factories.includes("protein") ? `
					<div class="factory" id="factoryProtein" style="width: ${(100 / this.planetLookup[this.zoomTo].factories.length) - 1}%;">
						<h3>Produce Protein at this factory</h3><p>requires: ${this.factoryLookup["Protein"].uses.join(" + ")}</p>
						<p name="level">Level ${this.planet.buildings["Protein".toLowerCase()].level}</p>
						${(this.planet.buildings["Protein".toLowerCase()].level < 100 ? `<button onclick="game.levelUp('Protein')">Level Up (${(Math.pow(this.planet.buildings["Protein".toLowerCase()].level, 2) * this.factoryLookup["Protein"].cost)} credits)</button>` : '')}
					</div>` : '')}
					${(this.planetLookup[this.zoomTo].factories.includes("sugar") ? `
					<div class="factory" id="factorySugar" style="width: ${(100 / this.planetLookup[this.zoomTo].factories.length) - 1}%;">
						<h3>Produce Sugar at this factory</h3><p>requires: ${this.factoryLookup["Sugar"].uses.join(" + ")}</p>
						<p name="level">Level ${this.planet.buildings["Sugar".toLowerCase()].level}</p>
						${(this.planet.buildings["Sugar".toLowerCase()].level < 100 ? `<button onclick="game.levelUp('Sugar')">Level Up (${(Math.pow(this.planet.buildings["Sugar".toLowerCase()].level, 2) * this.factoryLookup["Sugar"].cost)} credits)</button>` : '')}
					</div>` : '')}
				</div>
			`));
		}

		// Puchase some goods to take to the next colony
		buyGoods: {
			let button = document.createElement('button');
			button.setAttribute("id", "buyGoodsCityView");
			button.setAttribute('onclick', `game.buyGoodsCityView("${this.zoomTo}")`);
			menu.append(button);

			let buttonLive = $('#buyGoodsCityView');
			buttonLive.text("Trade");
			buttonLive.css({
				height: "1cm",
				width: "100%",
			});
		}
	}

	async buyGoodsCityView(planet) {
		let menu = this.createMenu();
		menu: {
			$('#menu').css({
				"background-image": `url("${this.planets[planet].texture}")`,
				"background-size": "cover",
				"background-repeat": "repeat",
				"overflow-x": "hidden",
				"overflow-y": "auto",

				width: "75%",
				height: "75%",
			});
		}

		createHeading: {
			menu.append($.parseHTML(`<h1 id="heading">Buy Goods from the Planet Market</h1>`));
			$('#heading')
				.text(`Buy Goods from the Planet Market`)
				.css({ "background-color": "RGBA(25, 25, 25, 0.75)" });

			menu.append($.parseHTML('<div class="credits"></div>'));
		}

		goodsWindow: {
			let div = document.createElement('div');
			div.setAttribute("id", "buyList")
			menu.append(div);
			let buyList = $('#buyList')
			buyList.css({
				height: "75%",
				"overflow-y": "scroll",
				"overflow-x": "hidden",
				"background-color": "RGBA(25,25,25,0.75)"
			});
			this.getBuyGoods(planet)
				.then((goods: any) => {
					let buyList = $('#buyList')
					for (let item of goods) {
						let p = $.parseHTML(`
						<p data='${JSON.stringify(item)}'><strong style="font-size: 1.25em;">1 unit of ${item.name} for ${item.price} credit(s) (Mass:${item.mass})</strong><br />
							In Stock: ${Number(item.stock).toFixed(0)}
								<button onclick="game.buyGoods('${item.name}', 1, '${planet}')">Buy 1</button>
								<button onclick="game.buyGoods('${item.name}', 10, '${planet}')">Buy 10</button>
								<button onclick="game.buyGoods('${item.name}', 100, '${planet}')">Buy 100</button>
							<br />
							In Cargo: ${Number(this.planet.goods[this.goodsLookup[item.name].index].stock).toFixed(0)}
								<button onclick="game.sellGoods('${item.name}', 1, '${planet}')">Sell 1</button>
								<button onclick="game.sellGoods('${item.name}', 10, '${planet}')">Sell 10</button>
								<button onclick="game.sellGoods('${item.name}', 100, '${planet}')">Sell 100</button>
						</p>
						<hr/>`);
						buyList.append(p);
					}
				})
				.catch((err) => {
					console.log("049c3df9-af8d-5ec7-9ff3-5aa4cb90f85a");
					this.message("Error in console");
					console.error(err);
				});
		}

		// TODO: Back button.
		bakcButton: {
			let button = document.createElement('button');
			button.setAttribute("id", "back");
			button.setAttribute('onclick', 'game.settlementMenu()');
			menu.append(button);

			let buttonLive = $('#back');
			buttonLive.text("back");
			buttonLive.css({
				height: "1cm",
				width: "100%",
			});
		}
	}

	async levelDown(factory) {
		console.log(factory, "levelDown", "b88adf65-d316-5587-a35a-7292323cda46");
		factory = factory.toLowerCase();
		if (this.planet.buildings[factory].level = 0) {
			let cost: number = Math.pow(this.planet.buildings[factory].level, 2) * this.factoryLookup["Sugar"].cost;
			if (cost <= this.planet.wealth) {
				this.planet.buildings[factory].level -= 1;
				this.planet.wealth -= cost;
				this.pay += cost;
			} else {
				this.message("Insufficient Wealth");
			}
		}
		this.settlementMenu(this.zoomTo);
	}

	async levelUp(factory) {
		console.log(factory, "levelUp", "ef24b0b8-e15e-50f0-82f1-83876b344f50");
		factory = factory.toLowerCase();
		if (this.planet.buildings[factory].level < 100) {
			let cost: number = Math.pow(this.planet.buildings[factory].level, 2) * this.factoryLookup["Sugar"].cost;
			if (cost <= this.planet.wealth) {
				this.planet.buildings[factory].level += 1;
				this.planet.wealth -= cost;
				this.pay += cost;
			} else {
				this.message("Insufficient Wealth");
			}
		}
		this.settlementMenu(this.zoomTo);
	}

	async startCaptain() {
		console.log("b31b1d42-d736-5e5d-a6bc-6b030362efd4");
		this.career = "Captain";
		$('#menu').remove();

		// Send a position update to the server every second (when flying);
		setInterval(this.updateServer.bind(this), 1000 / this.updateServerInterval);

		// Would be really good to introduce some sound with this.  Like a Trill, and a bit of base.

		let menu = this.createMenu();
		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text("From what world do you hail?").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		Mercury: {
			let button = document.createElement('button');
			button.setAttribute("id", "mercuryButton");
			button.setAttribute('onclick', 'game.dock("mercury")');
			menu.append(button);

			let buttonLive = $('#mercuryButton');
			buttonLive.text("Mercury");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		Venus: {
			let button = document.createElement('button');
			button.setAttribute("id", "venusButton");
			button.setAttribute('onclick', 'game.dock("venus")');
			menu.append(button);

			let buttonLive = $('#venusButton');
			buttonLive.text("Venus");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		Earth: {
			let button = document.createElement('button');
			button.setAttribute("id", "earthButton");
			button.setAttribute('onclick', 'game.dock("earth")');
			menu.append(button);

			let buttonLive = $('#earthButton');
			buttonLive.text("Earth");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		Mars: {
			let button = document.createElement('button');
			button.setAttribute("id", "marsButton");
			button.setAttribute('onclick', 'game.dock("mars")');
			menu.append(button);

			let buttonLive = $('#marsButton');
			buttonLive.text("Mars");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}
	}

	async startDockingLoop() {
		this.shipDockingTimer = setInterval(this.testDocking.bind(this), 2000);
	}

	async testDocking() {
		for (let planet in this.planets) {
			let distance = this.distanctCalc(planet);
			// !CONFIG
			if (300 > Number(distance)) {
				this.dock(planet);
			}
		}
	}

	async dock(planet) {
		console.log("57ee2de1-e180-5e52-bf35-3f157c0d49c6");
		$('#menu').remove();
		$('#shipBox').remove();
		$('.otherShip').remove();
		if (this.shipView) {
			clearInterval(this.shipView);
			this.shipView = undefined;
		}
		if (this.shipCompas) {
			clearInterval(this.shipCompas);
			this.shipCompas = undefined;
		}
		if (this.shipDockingTimer) {
			clearInterval(this.shipDockingTimer);
			this.shipDockingTimer = undefined;
		}

		// Play some landing sound here, and the unique sounds for this nation.

		console.log(planet);

		this.docked = true;

		this.zoomTo = planet;
		this.zoom = this.planets[planet].zoom
		this.planetMenu(planet);
	}

	async launch() {
		// Spawn a ship and get this captain out into space!
		this.docked = false;

		this.ship.velocity = 0;


		$('#menu').remove();
		$('#gameMap').append($.parseHTML(`<div id="shipBox">
			<div id="arrow"></div>
			<div id="myShip"></div>
		</div>`));
		$('#shipBox').css($('#' + this.zoomTo).css(["position", "top", "left"]));

		$('#myShip').css({
			position: "realative",
			top: "0px",
			left: "0px",
			"z-index": 1,
			"background-image": `url(${this.resource.myShip})`,
			height: "87px",
			width: "297px",
		});

		this.zoomTo = "myShip";

		this.shipView = setInterval(() => {
			this.focusShip();
		}, 1000 / 20);
		this.focusShip();

		this.shipCompas = setInterval(() => {
			this.showVectorToPlanet();
		}, this.navUpdateTimer);
		this.showVectorToPlanet();

		$(window).on('keydown', this.keyboard.bind(this));

		setTimeout(() => {
			this.startDockingLoop();
		}, 10000);
	}

	async keyboard(event) {
		console.log(event.key);
		switch (event.key) {
			case "ArrowUp": {
				// The player can consume just slightly more fuel than exists, but that's ok for a game.
				if (this.ship.cargo["Liquid Methane (CH4)"].stock >= 0) {
					console.log("ArrowUp");
					this.ship.velocity++;

					// Fuel consumption and mass reduction
					let forceUsed = this.MathForce(1, this.ship.mass);
					// This is not making the engines more efficient, it's making them more powrful...
					let consumed = (forceUsed / this.goodsLookup["Liquid Methane (CH4)"].force) * (1 - (this.ship["Engines"].value / 100));
					this.ship.cargo["Liquid Methane (CH4)"].stock -= consumed;
					this.ship.mass -= (forceUsed / this.goodsLookup["Liquid Methane (CH4)"].force) * this.goodsLookup["Liquid Methane (CH4)"].mass;
					// Ship should accellerate
					break;
				} else {
					this.message("You have run out of fuel, Hopefully you can coast into an orbit.");
				}
			}
			case "ArrowDown": {
				// The player can consume just slightly more fuel than exists, but that's ok for a game.
				if (this.ship.cargo["Liquid Methane (CH4)"].stock >= 0) {
					console.log("ArrowDown");
					this.ship.velocity--;

					// Fuel consumption and mass reduction
					let forceUsed = this.MathForce(1, this.ship.mass);
					// This is not making the engines more efficient, it's making them more powrful...
					let consumed = (forceUsed / this.goodsLookup["Liquid Methane (CH4)"].force) * (1 - (this.ship["Engines"].value / 100));
					this.ship.cargo["Liquid Methane (CH4)"].stock -= consumed;
					this.ship.mass -= (forceUsed / this.goodsLookup["Liquid Methane (CH4)"].force) * this.goodsLookup["Liquid Methane (CH4)"].mass;

					break;
				} else {
					this.message("You have run out of fuel, Hopefully you can coast into an orbit.");
				}
			}
			case "ArrowLeft": {
				console.log("ArrowLeft");
				// Ship sould rotate left
				this.ship.rotation = (this.ship.rotation - (1 + (this.ship["Attitude Control"].value / 25))) % 360;
				break;
			}
			case "ArrowRight": {
				console.log("ArrowRight");
				// Ship should rotate right
				this.ship.rotation = (this.ship.rotation + (1 + (this.ship["Attitude Control"].value / 25))) % 360;
				break;
			}
		}
		console.log(this.ship);
	}

	async focusShip() {
		let shipBox: any = $('#shipBox').css(["height", "width", "top", "left"]);
		for (let key in shipBox) {
			shipBox[key] = Number(shipBox[key].replace(/px/gi, '')).toFixed(10);
		}

		let angle = ((Math.PI / 180) * (this.ship.rotation)) % 360;

		$('#myShip').css({
			transform: `rotate(${this.ship.rotation}deg)`
		});

		$('#shipBox').css({
			top: `${+shipBox.top + (Math.sin(angle) * ((this.ship.velocity)))}px`,
			left: `${+shipBox.left + (Math.cos(angle) * ((this.ship.velocity)))}px`,
		});

		$('#gameMap').append($.parseHTML('<div id="measure"></div>'));
		let measure = $('#measure');
		let stats: any = measure.css({
			height: "1vh",
			width: "1vw",
		}).css(["height", "width"]);

		stats.height = Number(stats.height.replace(/px/gi, '')).toFixed(10);
		stats.width = Number(stats.width.replace(/px/gi, '')).toFixed(10);

		measure.remove();

		$('#gameMap').css({
			top: `-${+shipBox.top - ((stats.height * 50) - (shipBox.height / 2))}px`,
			left: `-${+shipBox.left - ((stats.width * 50) - (shipBox.width / 2))}px`,
		});
	}

	async updateServer() {
		if ("Captain" == this.career) {
			this.updateCaptain();
		} else if ("Governor" == this.career) {
			this.updateGovernor();
		}
	}

	async updateGovernor() {
		let prom = new Promise((resolve, reject) => {
			$.post('/updateCity', { accId: this.accountName, planet: this.zoomTo, city: this.planet, pay: this.pay }, resolve);
			this.pay = 0;
		});

		return prom;
	}

	async updateCaptain() {
		if ($('#shipBox').length) {
			let shipBox: any = $('#shipBox').css(["height", "width", "top", "left"]);
			for (let key in shipBox) {
				shipBox[key] = Number(shipBox[key].replace(/px/gi, '')).toFixed(10);
			}

			let angle = ((Math.PI / 180) * (this.ship.rotation)) % 360;

			let position = {
				top: `${+shipBox.top + (Math.sin(angle) * ((this.ship.velocity)))}`,
				left: `${+shipBox.left + (Math.cos(angle) * ((this.ship.velocity)))}`,
				angle,
				velocity: this.ship.velocity
			}
			let prom = new Promise((resolve, reject) => {
				$.post('/updatePosition', { accId: this.accountName, position }, resolve);
			});

			prom.catch((e) => {
				console.error(e);
				this.message('Comm err - check console - network issues?');
			});

			prom.then((data: any) => {
				this.drawOtherShips(data.notify);
				if (undefined != data.event.name) {
					this.message(`Event: ${data.event.name} - ${data.event.message}`);

					let loss = 1 - data.event.cargo;

					for (let key in this.ship.cargo) {
						let item = this.ship.cargo[key];
						item.stock *= loss;
						this.ship.mass -= loss * this.goodsLookup[key].mass;
					}

					switch (data.event.name) {
						case "solarFlare": {
							console.log("df0092bb-c177-5b51-a962-d3cc459301d4");
							screenFlare: {
								let body = $('body');
								let div = document.createElement('div');
								div.setAttribute("id", "flare");
								body.append(div);

								let flare = $('#flare');
								flare.hide();
								flare.css({
									position: "absolute",
									margin: "0 0",
									top: "0px",
									left: "0px",

									height: "100vh",
									width: "100vw",

									"background-color": "rgba(255, 255, 0, 0.3)",
								});
								flare.fadeIn(1000 / 6).fadeOut(1000 / 6);
								setTimeout(() => {
									console.log("200df3ee-da61-5dc2-992f-e9a521d3b467");
									$('#flare').remove();
								}, 1000 / 6 * 3);
							}
							break;
						}
					}
				}
			});

			return prom;
		}
	}

	async drawOtherShips(ships) {
		$('.otherShip').remove();
		for (let key in ships) {
			let ship: any = ships[key];
			$('#gameMap').append($.parseHTML(`<div class="otherShip" id="ShipId${key}">
				<div id="shipImg${key}"></div>
			</div>`));

			$(`#shipImg${key}`).css({
				position: "relative",
				top: `0px`,
				left: `0px`,
				"z-index": 1,
				"background-image": `url(${this.resource.myShip})`,
				height: "87px",
				width: "297px",
				transform: `rotate(${ship.angle}deg)`
			});

			$(`#ShipId${key}`).css({
				position: "relative",
				top: `${+ship.top}px`,
				left: `${+ship.left}px`,
			});
		}
	}

	async showVectorToPlanet() {
		if (!this.navTarget) {
			// Always nav to earth if nothing else is selected.
			this.navTarget = "earth";
		}

		let dest: any = $(`#${this.navTarget}`).css(["top", "left"]);
		for (let key in dest) {
			dest[key] = Number(dest[key].replace(/px/gi, '')).toFixed(10);
		}
		let ship: any = $('#shipBox').css(["top", "left"]);
		for (let key in ship) {
			ship[key] = Number(ship[key].replace(/px/gi, '')).toFixed(10);
		}

		var angleDeg = Math.atan2(+dest.top - +ship.top, +dest.left - +ship.left) * 180 / Math.PI;

		$('#arrow').css({
			position: "relative",
			top: "0px",
			left: "0px",
			"z-index": 2,
			transform: `rotate(${angleDeg}deg)`,
			"background-image": `url(${this.resource.arrow})`,
			width: "486px",
			height: "78px",
		});

		this.updateNavigation();
	}

	// Get the pointer for where the player wants to go.
	async navigate(planet) {
		this.navTarget = planet;
		$('#destination').text("Going to: " + planet.toUpperCase());
	}

	async updateNavigation() {
		for (let planet in this.planets) {
			let distance = this.distanctCalc(planet);
			$('#' + planet + 'Nav').text(`${planet.toLocaleUpperCase()} ${distance}`);
		}
	}

	distanctCalc(planet) {
		let dest: any = $(`#${planet}`).css(["top", "left"]);
		for (let key in dest) {
			dest[key] = Number(dest[key].replace(/px/gi, '')).toFixed(10);
		}

		// console.log(for (let key);
		let ship: any = $('#shipBox').css(["top", "left"]);
		for (let key in ship) {
			ship[key] = Number(ship[key].replace(/px/gi, '')).toFixed(10);
		}
		// console.log(for (let key);

		return Math.sqrt(((+dest.top - +ship.top) ** 2) + ((+dest.left - +ship.left) ** 2)).toFixed(0);
	}

	async planetMenu(planet) {
		let menu = this.createMenu();
		$('#menu').css({
			"background-image": `url("${this.planets[planet].texture}")`,
			"background-size": "cover",
			"background-repeat": "repeat",
			"overflow-x": "hidden",
			"overflow-y": "auto",

			width: "75%",
			height: "75%",
		});

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text(planet.toUpperCase()).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });

			let p = document.createElement('p');
			p.setAttribute("id", "population")
			menu.append(p);
			console.log(planet);
			this.getPopulation(planet).then((data: any) => {
				$('#population').text(`Population: ${data.population}`).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
			});

			p = document.createElement('p');
			p.setAttribute("id", "paragraph")
			menu.append(p);
			$('#paragraph').text(this.planets[planet].flavorText).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		// Display the orders screen
		showOrders: {
			let button = document.createElement('button');
			button.setAttribute("id", "showOrders");
			button.setAttribute('onclick', 'game.showOrders()');
			menu.append(button);

			let buttonLive = $('#showOrders');
			buttonLive.text("Show Orders");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		// Puchase some goods to take to the next colony
		buyGoods: {
			let button = document.createElement('button');
			button.setAttribute("id", "buyGoodsView");
			button.setAttribute('onclick', `game.buyGoodsView("${planet}")`);
			menu.append(button);

			let buttonLive = $('#buyGoodsView');
			buttonLive.text("Trade");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		// Puchase some goods to take to the next colony
		upgradeShip: {
			let button = document.createElement('button');
			button.setAttribute("id", "upgradeShipView");
			button.setAttribute('onclick', `game.upgradeShipView('${planet}')`);
			menu.append(button);

			let buttonLive = $('#upgradeShipView');
			buttonLive.text("Upgrade Ship");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		Launch: {
			let button = document.createElement('button');
			button.setAttribute("id", "launch");
			button.setAttribute('onclick', 'game.launch()');
			menu.append(button);

			let buttonLive = $('#launch');
			buttonLive.text("Launch");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		// Now I need to zoom to the planet....
	}

	async upgradeShipView(planet) {
		let menu = this.createMenu();
		menu: {
			$('#menu').css({
				"background-image": `url("${this.planets[planet].texture}")`,
				"background-size": "cover",
				"background-repeat": "repeat",
				"overflow-x": "hidden",
				"overflow-y": "auto",

				width: "75%",
				height: "75%",
			});
		}

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text("Upgrade Ship").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		goodsWindow: {
			let div = document.createElement('div');
			div.setAttribute("id", "upgradeList")
			menu.append(div);
			let upgradeList = $('#upgradeList')
			upgradeList.css({
				height: "75%",
				"overflow-y": "scroll",
				"overflow-x": "hidden",
				"background-color": "RGBA(25,25,25,0.75)"
			});
			this.getUpgradeList(planet)
				.then((upgrades: any) => {
					console.log(upgrades);
					// [{ name: "Attitude Control", cost: 4, mass: 7873 / 10 }]
					let upgradeList = $('#upgradeList')
					for (let key in upgrades) {
						console.log(key);
						let item = upgrades[key];
						console.log(item);
						let p = $.parseHTML(
							'<div style="width: 100%;">' +
							item.name + ' ' +
							(this.ship[item.name].value > 1 ? `<button onclick="game.upgradeShip('${item.name}', -1)">Sell Upgrade (${(item.cost * (this.ship[item.name].value - 1)).toFixed(0)} credits)</button>` : '') +
							`<div class="percent" id="${item.name}Bar"><div class="percentGreen" style="width: ${this.ship[item.name].value}%;"></div></div>` +
							(this.ship[item.name].value < 100 ? `<button onclick="game.upgradeShip('${item.name}', 1)">Upgrade (${(item.cost * this.ship[item.name].value).toFixed(0)} credits)</button>` : '') +
							`</div><hr/>`);
						upgradeList.append(p);
					}
				})
				.catch((err) => {
					console.log("049c3df9-af8d-5ec7-9ff3-5aa4cb90f85a");
					this.message("Error in console");
					console.error(err);
				});
		}

		// Display the orders screen
		showOrders: {
			let button = document.createElement('button');
			button.setAttribute("id", "showOrders");
			button.setAttribute('onclick', 'game.showOrders()');
			menu.append(button);

			let buttonLive = $('#showOrders');
			buttonLive.text("Show Orders");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		Launch: {
			let button = document.createElement('button');
			button.setAttribute("id", "launch");
			button.setAttribute('onclick', 'game.launch()');
			menu.append(button);

			let buttonLive = $('#launch');
			buttonLive.text("Launch");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}
	}

	async getUpgradeList(planet) {
		// TODO: Implement
		return new Promise((resolve, reject) => {
			$.getJSON('/getUpgradeList', { planet }, resolve);
		});
	}

	async upgradeShip(part, quantity) {
		// TODO: Implement
		let prom = new Promise((resolve, reject) => {
			$.post(
				'/upgradeShip',
				{
					level: this.ship[part].value,
					part,
					quantity,
					wealth: this.ship.wealth,
					planet: this.zoomTo
				},
				resolve);
		});

		prom.then((data: any) => {
			// Changes to the ship and wealth
			if (data.success) {
				this.ship.wealth += Number(data.wealth);
				this.ship[part].value = Number(data.level);

				if (part == "Sensors") {
					this.navUpdateTimer = 10000 * (1 - (this.ship["Sensors"].value / 100));
				}
			} else {
				this.message(data.message);
			}
			// Refresh the view
			this.upgradeShipView(this.zoomTo);
		});

		return prom;
	}

	async buyGoodsView(planet) {
		let menu = this.createMenu();
		menu: {
			$('#menu').css({
				"background-image": `url("${this.planets[planet].texture}")`,
				"background-size": "cover",
				"background-repeat": "repeat",
				"overflow-x": "hidden",
				"overflow-y": "auto",

				width: "75%",
				height: "75%",
			});
		}

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text("Trade").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		goodsWindow: {
			let div = document.createElement('div');
			div.setAttribute("id", "buyList")
			menu.append(div);
			let buyList = $('#buyList')
			buyList.css({
				height: "75%",
				"overflow-y": "scroll",
				"overflow-x": "hidden",
				"background-color": "RGBA(25,25,25,0.75)"
			});
			this.getBuyGoods(planet)
				.then((goods: any) => {
					console.log(goods);
					let buyList = $('#buyList')
					for (let item of goods) {
						console.log(item);
						let p = $.parseHTML(`<p data='${JSON.stringify(item)}'><strong style="font-size: 1.25em;">1 unit of ${item.name} for ${item.price} credit(s) (Mass:${item.mass})</strong><br />
						In Stock: ${Number(item.stock).toFixed(0)}<button onclick="game.buyGoods('${item.name}', 1, '${planet}')">Buy 1</button><button onclick="game.buyGoods('${item.name}', 10, '${planet}')">Buy 10</button><button onclick="game.buyGoods('${item.name}', 100, '${planet}')">Buy 100</button><br />
						In Cargo: ${Number(this.ship.cargo[item.name].stock).toFixed(0)}<button onclick="game.sellGoods('${item.name}', 1, '${planet}')">Sell 1</button><button onclick="game.sellGoods('${item.name}', 10, '${planet}')">Sell 10</button><button onclick="game.sellGoods('${item.name}', 100, '${planet}')">Sell 100</button>
						</p><hr/>`);
						buyList.append(p);
					}
				})
				.catch((err) => {
					console.log("049c3df9-af8d-5ec7-9ff3-5aa4cb90f85a");
					this.message("Error in console");
					console.error(err);
				});
		}

		// Display the orders screen
		showOrders: {
			let button = document.createElement('button');
			button.setAttribute("id", "showOrders");
			button.setAttribute('onclick', 'game.showOrders()');
			menu.append(button);

			let buttonLive = $('#showOrders');
			buttonLive.text("Show Orders");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}

		Launch: {
			let button = document.createElement('button');
			button.setAttribute("id", "launch");
			button.setAttribute('onclick', 'game.launch()');
			menu.append(button);

			let buttonLive = $('#launch');
			buttonLive.text("Launch");
			buttonLive.css({
				border: "3px solid goldenrod",

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}
	}

	async buyGoods(item, quantity, planet) {
		if (quantity < this.getCargoNow() || "Governor" == this.career) {
			let prom = new Promise((resolve, reject) => {
				let wealth;
				if ("Captain" == this.career) {
					wealth = this.ship.wealth;
				} else if ("Governor" == this.career) {
					wealth = this.planet.wealth;
				}
				$.post('/buyGoods', { item, quantity, planet, wealth }, resolve);
			});

			prom.then((data: { name: string, price: string, mass: string, stock: string, message?: string }) => {
				if (data.message) {
					this.message(data.message);
				} else {
					let name: string = data.name;
					let price: number = Number(data.price);
					let mass: number = Number(data.mass);
					let stock: number = Number(data.stock);

					if ("Captain" == this.career) {
						this.ship.cargo[name].stock += stock;
						this.ship.mass += mass * stock;
						this.ship.wealth -= price * stock;

						// Refresh the view
						this.buyGoodsView(this.zoomTo);
					} else if ("Governor" == this.career) {
						this.planet.goods[this.goodsLookup[name].index].stock += stock;
						this.planet.wealth -= price * stock;

						// Refresh the view
						this.buyGoodsCityView(this.zoomTo);
					}

					this.message("Transaction complete");
				}

			}).catch((e) => {
				console.error(e);
				try {
					this.message(e);
				} catch (e) { }
			});

			return prom;
		} else {
			this.message('You do not have sufficient cargo space');
		}
	}

	async sellGoods(item, quantity, planet) {
		if (quantity < this.ship.cargo[item].stock || ("Governor" == this.career && quantity < this.planet.goods[this.goodsLookup[item].index].stock)) {
			let prom = new Promise((resolve, reject) => {
				$.post('/sellGoods', { item, quantity, planet }, resolve);
			});

			prom.then((result: { message?: string, name: string, price: string, mass: string, stock: string }) => {
				if (result.message) {
					this.message(result.message);
				} else {
					let name = result.name;
					let price = Number(result.price);
					let mass = Number(result.mass);
					let stock = Number(result.stock);

					if ("Captain" == this.career) {
						this.ship.cargo[name].stock -= stock;
						this.ship.mass -= mass * stock;
						this.ship.wealth += price * stock;

						// Refresh the view
						this.buyGoodsView(this.zoomTo);
					} else if ("Governor" == this.career) {
						this.planet.goods[this.goodsLookup[name].index].stock -= stock;
						this.planet.wealth += price * stock;

						// Refresh the view
						this.buyGoodsCityView(this.zoomTo);
					}

					this.message("Transaction complete");
				}
			}).catch((e) => {
				console.log("3eb8a93a-a21c-5461-b9d7-ab3646923c28");
				console.error(e);
				this.message("Error in console");
			});

			return prom;
		} else {
			this.message('You do not have that much to sell');
		}
	}

	async getBuyGoods(planet) {
		return new Promise((resolve, reject) => {
			$.getJSON("buyGoods", { planet }, resolve)
		});
	}

	async message(message) {
		$.notify(message);
	}

	async getOrders() {
		return new Promise((resolve, reject) => {
			$.getJSON("orders", {}, resolve)
		});
	}

	async showOrders() {
		this.getOrders().then((data: any) => {
			console.log("ab36f657-449e-520a-b878-1ac1170ecb1b");
			let menu = this.createMenu();

			createHeading: {
				let h1 = document.createElement('h1');
				h1.setAttribute("id", "heading")
				menu.append(h1);
				$('#heading').text("Supply Requests").css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
			}

			createScrollList: {
				let div = document.createElement('div');
				div.setAttribute("id", "orderList")
				menu.append(div);
				let orderList = $('#orderList')
				orderList.css({
					height: "75%",
					"overflow-y": "scroll",
					"overflow-x": "hidden",
					"background-color": "RGBA(25,25,25,0.75)"
				});

				for (let order of data) {
					let p = $.parseHTML(`<p>${JSON.stringify(order)}</p>`);
					orderList.append(p);
				}
			}

			createButton: {
				let button = document.createElement('button');
				button.setAttribute("id", "buttonLive");
				button.setAttribute('onclick', 'game.close()');
				menu.append(button);

				let buttonLive = $('#buttonLive');
				buttonLive.text("Close");
				buttonLive.css({
					border: "3px solid goldenrod",

					height: "1cm",
					width: "100%",
					margin: "3px 0px",

					"text-align": "center",
					"font-size": "1.5em",
					color: "goldenrod"
				});
			}
		}).catch((err) => {
			console.log("044c4b90-096c-5ff7-8e5b-cd290549d94b");
			this.message("Error in console");
			console.error(err);
		});
	}

	async showStock() {
		// A shop screen where the player can Trade to fill orders
		// Should also show what the ship has onboard, so we know our stock level and can sell from this screen as well.
		this.message("Not implemented yet");
	}

	async outfit() {
		// Allow the player to change the armament of their ship, so they can raid or bounty hunt or pirate.
		this.message("Not implemented yet");
	}

	async close() {
		if (this.docked == true) {
			this.planetMenu(this.zoomTo);
		}
	}

	// Create the menu div
	// Is not ASYNC because other things depend on it forming.
	createMenu() {
		console.log("ab36f657-449e-520a-b878-1ac1170ecb1b");
		let body = $('body');
		let menu;
		$('#menu').remove();

		createMenuDiv: {
			let div = document.createElement('div');
			div.setAttribute("id", "menu");
			body.append(div);

			menu = $('#menu');
			menu.css({
				position: "relative",
				margin: "0 auto",
				top: "3cm",

				width: "16cm",
				height: "9cm",

				// Text and content
				"align-items": "center",
				color: "goldenrod",
			});
		}
		return menu;
	}

	// Sets up the background of the game
	background() {
		$('body').css({
			background: 'black',
			"background-image": `url("${this.backgroundUrl}")`,
			"background-size": "cover",
			"background-repeat": "repeat",
			overflow: "hidden",

			position: "absolute",
			top: "0",
			left: "0",
			animation: "mymove 120s ease-in-out infinite",

			width: '100%',
			height: '100%',
			margin: "0px 0px 0px 0px",
			padding: "0px 0px 0px 0px",
		});

		this.addPlanets()

		// new Promise((resolve, reject) => {
		// 	console.log($.getJSON(this.url.server, {}, resolve));
		// }).then((jsonData) => {
		// 	console.log(jsondata);
		// }).catch((err) => {
		// 	this.message(`The game encountered an error: ${JSON.stringify(err)}`)
		// 	console.error("The game encountered an error", JSON.stringify(err));
		// });
	}

	async addPlanets() {
		createGameMapDiv: {
			let div = document.createElement('div');
			div.setAttribute("id", "gameMap");
			$('body').append(div);

			let gameMap = $('#gameMap');
			gameMap.css({
				position: "absolute",
				top: "0",
				left: "0",

				width: '100%',
				height: '100%',

				// "background-color": "blue"
			});
		}

		/*
						let stats: any = this.measure();
						if ("sun" == index) {
		
							// Create the sun in the center of the screen.
							sun = $('#' + index)
								.css({
									top: `${((50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10)}px`,
									left: `${((50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10)}px`,
		
		
									// "background-color": "red"
								}).css(["height", "width"]);
		
							sun.top = ((50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10);
							sun.left = ((50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10);
		
							// Get the top and left of the sun so we can offset from the point + half the suns height/width
							for (let key in sun) {
								sun[key] = Number(sun[key].replace(/px/gi, '')).toFixed(10);
							}
		
							if (index == this.zoomTo) {
								$('#gameMap').css({
									// top: `-${(50 * Number(stats.height) * this.zoom) - (Number(stats.height) * 50) + (this.zoom * planet.ratio / 2)}px`,
									// left: `-${(50 * Number(stats.width) * this.zoom) - (Number(stats.width) * 50) + (this.zoom * planet.ratio / 2)}px`,
									top: `-${+sun.top - ((stats.height * 50) - (sun.height / 2))}px`,
									left: `-${+sun.left - ((stats.width * 50) - (sun.width / 2))}px`,
								});
							}
						} else {
							$('#' + index).css({
		
		
								// "background-color": "red"
							}).animate({
								top: `${(Number(+sun.top) + (Number(sun.height) / 2) - (this.zoom * planet.ratio / 2) + (Math.cos(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
								left: `${(Number(+sun.left) + (Number(sun.width) / 2) - (this.zoom * planet.ratio / 2) + (Math.sin(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
		*/

		let sun;

		this.getPlanets().then((positions) => {
			for (let index in this.planets) {
				let planet = this.planets[index];
				$('#gameMap').append($.parseHTML(`<img id="${index}" src="${planet.img}" />`))
				$(`#${index}`).css({
					position: "absolute",
					height: `${this.zoom * planet.ratio}cm`,
					width: `${this.zoom * planet.ratio}cm`,
					margin: `0px 0px`,
				});

				let stats: any = this.measure();
				if ("sun" == index) {
					// Create the sun in the center of the screen.
					sun = $('#' + index).css({
						top: `${((50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10)}px`,
						left: `${((50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10)}px`,
					}).css(["height", "width"]);

					sun.top = ((50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10);
					sun.left = ((50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2) + 3000000).toFixed(10);

					// Get the top and left of the sun so we can offset from the point + half the suns height/width
					for (let key in sun) {
						sun[key] = Number(sun[key].replace(/px/gi, '')).toFixed(10);
					}
				} else {
					$('#' + index).css({
						top: `${(Number(+sun.top) + (Number(sun.height) / 2) - (this.zoom * planet.ratio / 2) + (Math.cos(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
						left: `${(Number(+sun.left) + (Number(sun.width) / 2) - (this.zoom * planet.ratio / 2) + (Math.sin(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
					});
				}
			}
		});
	}

	getPlanets = async () => {
		return {
			sun: {
				angle: 0,
			},
			mercury: {
				angle: (Math.PI / 180) * ((((((new Date().getTime() / 1000 / 60 / 60 / 24) % this.planets['mercury'].year) * this.acceleration) / this.planets['mercury'].year) % 1) * 360),
			},
			venus: {
				angle: (Math.PI / 180) * ((((((new Date().getTime() / 1000 / 60 / 60 / 24) % this.planets['venus'].year) * this.acceleration) / this.planets['venus'].year) % 1) * 360),
			},
			earth: {
				angle: (Math.PI / 180) * ((((((new Date().getTime() / 1000 / 60 / 60 / 24) % this.planets['earth'].year) * this.acceleration) / this.planets['earth'].year) % 1) * 360),
			},
			mars: {
				angle: (Math.PI / 180) * ((((((new Date().getTime() / 1000 / 60 / 60 / 24) % this.planets['mars'].year) * this.acceleration) / this.planets['mars'].year) % 1) * 360),
			},
			jupiter: {
				angle: (Math.PI / 180) * ((((((new Date().getTime() / 1000 / 60 / 60 / 24) % this.planets['jupiter'].year) * this.acceleration) / this.planets['jupiter'].year) % 1) * 360),
			},
			saturn: {
				angle: (Math.PI / 180) * ((((((new Date().getTime() / 1000 / 60 / 60 / 24) % this.planets['saturn'].year) * this.acceleration) / this.planets['saturn'].year) % 1) * 360),
			},
			uranus: {
				angle: (Math.PI / 180) * ((((((new Date().getTime() / 1000 / 60 / 60 / 24) % this.planets['uranus'].year) * this.acceleration) / this.planets['uranus'].year) % 1) * 360),
			},
			neptune: {
				angle: (Math.PI / 180) * ((((((new Date().getTime() / 1000 / 60 / 60 / 24) % this.planets['neptune'].year) * this.acceleration) / this.planets['neptune'].year) % 1) * 360),
			},
		};
	}

	async getPopulation(planet) {
		return new Promise((resolve, reject) => {
			$.getJSON('/population', { planet }, resolve);
		});
	}

	measure() {
		// let div: any = document.createElement('div');
		// div.setAttribute("id", "measure");
		// $('#gameMap').append(div);
		// let measure = $('#measure');
		// let stats: any = measure.css({
		// 	height: "1vh",
		// 	width: "1vw",
		// }).css(["height", "width"]);

		// stats.height = Number(stats.height.replace(/px/gi, '')).toFixed(10);
		// stats.width = Number(stats.width.replace(/px/gi, '')).toFixed(10);

		// measure.remove();
		// console.log(stats);

		// return stats;

		return { height: "9.89062", width: "19.1875" };
	}

	// Start playing the music if it is paused or stopped
	async MusicPlay() {
		this.soundElem.play();
	}

	async MusicPause() {
		this.soundElem.pause();
	}

	async MusicPrev() {
		console.log("7eda98a0-beea-512b-a496-c08d3437cf6e");
		try {
			this.soundElem.pause();
		} catch (e) { }

		this.musicTrack -= 1;
		if (this.musicTrack < 0) {
			this.musicTrack = this.musicList.length - 1;
		}
		this.jBeep(this.musicList[this.musicTrack]);
	}

	async MusicNext() {
		console.log("c3047c99-9572-5be7-8589-739a08c488c8");
		try {
			this.soundElem.pause();
		} catch (e) { }

		this.musicTrack += 1;
		if (this.musicTrack > this.musicList.length - 1) {
			this.musicTrack = 0;
		}
		this.jBeep(this.musicList[this.musicTrack]);
	}

	async MusicVolumeDown() {
		try {
			this.soundElem.volume -= 0.05
			this.volume = this.soundElem.volume;
			$('#volumeText').text(this.soundElem.volume);
			console.log("Volume", this.soundElem.volume);
			$('#nowPlaying').text(this.musicList[this.musicTrack] + " (Volume: " + (this.volume * 100).toFixed(0) + "%)");
		} catch (e) {
			// Do nothing, we just tried to adjust the volume too far
		}
	}

	async MusicVolumeUp() {
		try {
			this.soundElem.volume += 0.05
			this.volume = this.soundElem.volume;
			$('#volumeText').text(this.soundElem.volume);
			console.log("Volume", this.soundElem.volume);
			$('#nowPlaying').text(this.musicList[this.musicTrack] + " (Volume: " + (this.volume * 100).toFixed(0) + "%)");
		} catch (e) {
			// Do nothing, we just tried to adjust the volume too far
		}
	}

	async jBeep(soundFile) {

		if (!soundFile) soundFile = "jBeep/jBeep.wav";

		var soundElem, bodyElem, isHTML5;

		isHTML5 = true;
		try {
			if (typeof document.createElement("audio").play == "undefined") isHTML5 = false;
		}
		catch (ex) {
			isHTML5 = false;
		}

		bodyElem = document.getElementsByTagName("body")[0];
		if (!bodyElem) bodyElem = document.getElementsByTagName("html")[0];

		soundElem = document.getElementById("jBeep");
		if (soundElem) {
			soundElem.pause();
			bodyElem.removeChild(soundElem);
		}

		if (isHTML5) {
			soundElem = document.createElement("audio");
			soundElem.setAttribute("id", "jBeep");
			soundElem.setAttribute("src", soundFile);
			$('#nowPlaying').text(this.musicList[this.musicTrack] + " (Volume: " + (this.volume * 100).toFixed(0) + "%)");
			soundElem.volume = this.volume;
			soundElem.play();

			soundElem.addEventListener("ended", () => {
				this.MusicNext();
			});

			this.soundElem = soundElem;
		}
	}

	async chatSend() {
		let chatIn = $('.chatIn').val();
		$('.chatIn').val('');

		let prom = new Promise((resolve, reject) => {
			$.post('/chat', {
				chatIn,
				accountId: this.accountId,
				accountName: this.accountName,
			}, resolve);
		});

		prom.then((data) => {
			$(".chatBox").stop().animate({ scrollTop: $(".chatBox")[0].scrollHeight }, 1000);

			return data;
		});

		return prom;
	}

	async getChat() {
		let prom = new Promise((resolve, reject) => {
			$.getJSON('/chat', resolve)
		}).then((data: any) => {
			for (let message of data) {
				if (!this.chatMessages.includes(message)) {
					this.chatMessages.push(message);
					$('.chatBox').append($.parseHTML(`<p>${message}</p>`));
					$(".chatBox").stop().animate({ scrollTop: $(".chatBox")[0].scrollHeight }, 1000);
				}
			}
		});

		return prom;
	}

	async factoryWork() {
		let fact: any;
		for (fact in this.planet.buildings) {
			fact = this.planet.buildings[fact];
			if (fact.level > 0) {
				let success = true;
				switch (fact.name) {
					case "Water (H2O)":
					case "Air (N2 + O2 + CO2)":
					case "Sulphuric Acid (H2SO4)":
					case "Iron (Fe)":
					case "Liquid Methane (CH4)":
					case "Proteins":
					case "Sugars (C6H12O6)":
						let use: any;
						for (use of this.factoryLookup[fact.shortName].uses) {
							if (this.planet.goods[this.planet.buildings[use.toLowerCase()].index].stock < fact.level) {
								success = false;
								console.log("Resource deficit", fact.name, "Lacks", use.toLowerCase());
								break;
							}
						}
						if (success) {
							console.log("Increase", this.planet.goods, this.planet.buildings, fact.shortName.toLowerCase());
							this.planet.goods[this.planet.buildings[fact.shortName.toLowerCase()].index].stock += fact.level;
							for (use of this.factoryLookup[fact.shortName].uses) {
								console.log("Decrease", this.planet.goods[this.planet.buildings[use.toLowerCase()].index]);
								this.planet.goods[this.planet.buildings[use.toLowerCase()].index].stock -= fact.level;
							}
						}
						break;
				}
			}
		}
	}

	async resourceSink() {
		// Consume some resources every 10 minutes. - If there are not enough goods, people will die
		let grow = true;
		for (let item of this.planet.goods) {
			let consume
			switch (item.name) {
				case "Water (H2O)": {
					consume = 0.1 / 60;
					break;
				}
				case "Sugars (C6H12O6)": {
					consume = 0.033 / 60;
					break;
				}
				case "Proteins": {
					consume = 0.05 / 60;
					break;
				}
				case "Air (N2 + O2 + CO2)": {
					consume = 0.0525 / 60;
					break;
				}
			}
			if (consume) {
				item.stock = Math.max(0, item.stock - this.planet.goods[4].stock * consume);
				if (item.stock == 0) {
					grow = false;
					// Don't kill the entire planet all at once, just 1% of the population...
					this.planet.goods[4].stock -= Math.max(this.planet.goods[4].stock / 100, consume * this.planet.goods[4].stock);
					// Can't have half a person... Really, no you cant!
					this.planet.goods[4].stock = Math.floor(this.planet.goods[4].stock);
				}
			}
		}
		if (grow) {
			// Increase population at 0.5% per cycle
			this.planet.goods[4].stock += ((this.planet.goods[4].stock / 100) / 2);
			this.planet.goods[4].stock = Math.ceil(this.planet.goods[4].stock);
		}

		if (0 == this.planet.goods[4].stock) {
			this.lose();
		}
	}

	async shrinkDiv(x) {
		let parent = $(x).parent().parent();
		let width = Number($(parent).css(["width"]).width.replace(/px/gi, ''));
		// let height = Number($(parent).css(["height"]).height.replace(/px/gi, ''));
		$(parent).css({
			width: `${width / 1.1}px`,
			// height: `${height / 1.1}px`,
		});
	}

	async growDiv(x) {
		let parent = $(x).parent().parent();
		let width = Number($(parent).css(["width"]).width.replace(/px/gi, ''));
		// let height = Number($(parent).css(["height"]).height.replace(/px/gi, ''));
		$(parent).css({
			width: `${width * 1.1}px`,
			// height: `${height * 1.1}px`,
		});
	}

	lose() {
		console.log("Game Over");
		var x = 0;
		setInterval(() => {
			this.message(`Game Over - Population is zero - Reloading (Please Try Again :) You'll get it, or try the Captain Career) ${++x}/30`);
		}, 1000);

		setTimeout(() => {
			window.location.reload()
		}, 30000);
	}
}

$().ready(() => {
	// Export the game object to the global so it can be accessed.
	Object.assign(global, {
		game: new game()
	});
});