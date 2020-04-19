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

	ship: any = {
		rotation: 0,
		velocity: 0,
	};
	shipDockingTimer: NodeJS.Timeout;

	constructor() {
		console.log("Starting Game Constructor");

		this.backgroundUrl = "Planets/Textures/stars.jpg";

		this.url = {
			// server: "ld46-792073873.ap-southeast-2.elb.amazonaws.com"
			server: "127.0.0.1"
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
				zoom: 20
			},
			mercury: {
				radius: 2439,
				year: 1,
				ratio: 0.0035,
				auRatio: 0.012,
				img: `Planets/sphere/mercury.png`,
				texture: `Planets/Textures/mercury.jpg`,
				flavorText: "Mercury is a tiadally locked planet, meaning that one face is always to the sun, same as the Earths moon only ever shows one side to the earth. This has led to a unique growing environment for foods, which are cultivated in the sunset ring, on the edge of day and night.  An abundance of solar energe has made this world an exporter of all kinds of raw elements.  Especially Alumnimum which requires vast amounts of energy to refine.",
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
				zoom: 100
			},
			saturn: {
				radius: 60268,
				year: 120,
				ratio: 0.0866,
				auRatio: 0.318,
				img: `Planets/sphere/saturn.png`,
				texture: `Planets/Textures/saturn.jpg`,
				flavorText: "Saturn became \"The place\" for weddings when an ice meteor was captured by the gravity of Saturn, making Saturn look like it's wearing a Gigantic Diamond!  What better way to win a womans heart than dragging her to the farthest reaches of human civilisation.  There's nothing out here except for Tourists and small businesses that cater to them.  A good trade in Flowers and food is to be had at this far reach of the solar system.",
				zoom: 100
			},
			uranus: {
				radius: 25559,
				year: 348.40,
				ratio: 0.0367,
				auRatio: 0.638,
				img: `Planets/sphere/uranus.png`,
				texture: `Planets/Textures/uranus.jpg`,
				flavorText: "Noone visits Uranus, the jokes are far too much for any person to bare for the extremely long journey.  The few people to be found out this far, are normally on the run, or are turning a high profit from those on the run.  While there is money to be made, there's also a risk of losing your life or your ship!",
				zoom: 100
			},
			neptune: {
				radius: 24764,
				year: 684.37,
				ratio: 0.0355,
				auRatio: 1,
				img: `Planets/sphere/neptune.png`,
				texture: `Planets/Textures/neptune.jpg`,
				flavorText: "Neptune is the furthers that Humanity has travelled.  Out this far there are only a few Science stations and listening posts.  In the hope of making contact with Aliens and number of new religions exist out this far, mainly founded by Scientists who have found the pressure of working so far from the rest of humanity to be too much.  Little money is to be made comming here, but leaving and going back into the solar system will yield a high reward for those who can make the trip.",
				zoom: 100
			},
		}

		// Setup the game screen - Background etc
		this.background();

		setInterval(() => { this.zoom = this.zoom }, 500);

		this.showMenu();

		music: {
			this.musicList.push("Music/BeepBoxSong1.mp3");
			this.musicList.push("Music/BeepBoxSong2.mp3");
			this.musicList.push("Music/BeepBoxSong3.mp3");
			this.musicList.push("Music/BeepBoxSong4.mp3");
			this.musicList.push("Music/BeepBoxSong5.mp3");
			this.musicList.push("Music/BeepBoxSong6.mp3");
			this.musicList.push("Music/BeepBoxSong7.mp3");

			$('body').one("click", () => {
				this.jBeep(this.musicList[0]);
			});
		}

	}

	get zoom() {
		return this._zoom;
	}
	set zoom(value) {
		this._zoom = value;

		this.getPlanets().then((positions) => {
			let sun: any;
			for (let index in this.planets) {
				let planet = this.planets[index];
				let stats: any = this.measure();
				if ("sun" == index) {

					// Create the sun in the center of the screen.
					sun = $('#' + index).css({
						position: "absolute",
						top: `${(50 * Number(stats.height) * this.zoom) - (this.zoom * planet.ratio / 2)}px`,
						left: `${(50 * Number(stats.width) * this.zoom) - (this.zoom * planet.ratio / 2)}px`,

						height: `${this.zoom * planet.ratio}cm`,
						width: `${this.zoom * planet.ratio}cm`,
						margin: `0px 0px`,

						// "background-color": "red"
					}).css(["top", "left", "height", "width"]);

					// Get the top and left of the sun so we can offset from the point + half the suns height/width
					for (let key in sun) {
						sun[key] = Number(sun[key].replace(/[a-z]/gi, ''));
					}

					if (index == this.zoomTo) {
						$('#gameMap').css({
							// top: `-${(50 * Number(stats.height) * this.zoom) - (Number(stats.height) * 50) + (this.zoom * planet.ratio / 2)}px`,
							// left: `-${(50 * Number(stats.width) * this.zoom) - (Number(stats.width) * 50) + (this.zoom * planet.ratio / 2)}px`,
							top: `-${sun.top - ((stats.height * 50) - (sun.height / 2))}px`,
							left: `-${sun.left - ((stats.width * 50) - (sun.width / 2))}px`,
						});
					}
				} else {
					$('#' + index).css({
						position: "absolute",
						top: `${(sun.top + (sun.height / 2) - (this.zoom * planet.ratio / 2) + (Math.cos(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,
						left: `${(sun.left + (sun.width / 2) - (this.zoom * planet.ratio / 2) + (Math.sin(positions[index].angle) * ((this.distances * this.zoom * planet.auRatio))))}px`,

						height: `${this.zoom * planet.ratio}cm`,
						width: `${this.zoom * planet.ratio}cm`,
						margin: `0px 0px`,

						// "background-color": "red"
					});
					let dimensions: any = $('#' + index).css(["top", "left", "height", "width"]);

					// Get the top and left of the sun so we can offset from the point + half the suns height/width
					for (let key in dimensions) {
						dimensions[key] = Number(dimensions[key].replace(/[a-z]/gi, ''));
					}

					if (index == this.zoomTo) {
						$('#gameMap').css({
							top: `-${dimensions.top - ((stats.height * 50) - (dimensions.height / 2))}px`,
							left: `-${dimensions.left - ((stats.width * 50) - (dimensions.width / 2))}px`,
						});
					}
				}
			}
		});
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
		alert("Feature under development - 95004312-6e39-59a4-8b50-317730fe8b6a");
		console.log("Feature under development", "19eaf58d-9ba1-53a9-9b07-bd3b3c3b7e89");
	}

	// Will be a link to the Wiki or similar things
	async wiki() {
		alert("Feature under development - c94bf69f-764f-58a9-a9e9-4ba43e831dea");
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
				"background-color": "rgba(0,0,0,0)",
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

		createTutorialButton: {
			let tutorial = document.createElement('button');
			tutorial.setAttribute("id", "tutorialButton");
			tutorial.setAttribute('onclick', 'game.tutorial()');
			menu.append(tutorial);

			let tutorialButton = $('#tutorialButton');
			tutorialButton.text("Tutorial");
			tutorialButton.css({
				"background-color": "rgba(0,0,0,0)",
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

		createWikiButton: {
			let wiki = document.createElement('button');
			wiki.setAttribute("id", "wikiButton");
			wiki.setAttribute('onclick', 'game.wiki()');
			menu.append(wiki);

			let wikiButton = $('#wikiButton');
			wikiButton.text("Read the Wiki");
			wikiButton.css({
				"background-color": "rgba(0,0,0,0)",
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

		createAccountToken: {
			let acctInput = document.createElement('input');
			acctInput.setAttribute("type", "text")
			acctInput.setAttribute("id", "acctInput");
			menu.append(acctInput);

			let acctText = $('#acctInput');
			acctText.val(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
			acctText.css({
				"background-color": "rgba(0,0,0,0)",
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
				"background-color": "rgba(0,0,0,0)",
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
	}

	async login() {
		console.log("eb721136-fbf4-53ad-babe-66a049c058b6");
		let acctText = $('#acctInput');
		this.accountId = acctText.val().toString();
		$('#menu').remove();
		console.log("Loading account information - 6a576171-eba0-57a5-904c-462a22a2df2e");

		let prom = new Promise((resolve, reject) => {
			$.getJSON(
				"login",
				{
					accountId: this.accountId
				},
				resolve
			)
		}).then((data) => {
			console.log(data);
			if (true == data.isNew) {
				this.showCareers();
			} else {
				//  More complicated load function, we now have to restore the player to where they were, or maybe we say that they can only save if they are on a planet?  Otherwise career over?  (Don't get stuck hanging out in space a...)
				this.resumeCareer(data);
			}
		}).catch((err) => {
			console.log("177b0355-3289-509a-95c3-b18897ae2277");
			alert('error in console');
			console.error(err);
		});

		return prom;
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
				"background-color": "rgba(0,0,0,0)",
				border: "3px solid goldenrod",
				"background-color": "RGBA(25, 25, 25, 0.75)",

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
				"background-color": "rgba(0,0,0,0)",
				border: "3px solid goldenrod",
				"background-color": "RGBA(25, 25, 25, 0.75)",

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
		alert("Not yet implemented");

		// Would be good to play a sound here that is City founding esk
	}

	async startCaptain() {
		console.log("b31b1d42-d736-5e5d-a6bc-6b030362efd4");
		$('#menu').remove();

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
				"background-color": "rgba(0,0,0,0)",
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

		Venus: {
			let button = document.createElement('button');
			button.setAttribute("id", "venusButton");
			button.setAttribute('onclick', 'game.dock("venus")');
			menu.append(button);

			let buttonLive = $('#venusButton');
			buttonLive.text("Venus");
			buttonLive.css({
				"background-color": "rgba(0,0,0,0)",
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

		Earth: {
			let button = document.createElement('button');
			button.setAttribute("id", "earthButton");
			button.setAttribute('onclick', 'game.dock("earth")');
			menu.append(button);

			let buttonLive = $('#earthButton');
			buttonLive.text("Earth");
			buttonLive.css({
				"background-color": "rgba(0,0,0,0)",
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

		Mars: {
			let button = document.createElement('button');
			button.setAttribute("id", "marsButton");
			button.setAttribute('onclick', 'game.dock("mars")');
			menu.append(button);

			let buttonLive = $('#marsButton');
			buttonLive.text("Mars");
			buttonLive.css({
				"background-color": "rgba(0,0,0,0)",
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
	}
	
	async startDockingLoop() {
		this.shipDockingTimer = setInterval(this.testDocking.bind(this), 2000);
	}
	
	async testDocking() {
		for (let planet in this.planets) {
			let distance = this.distanctCalc(planet);
			if (700 > Number(distance)) {
				this.dock(planet);
			}
		}
	}

	async dock(planet) {
		console.log("57ee2de1-e180-5e52-bf35-3f157c0d49c6");
		$('#menu').remove();
		$('#shipBox').remove();
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
		}, 1000/30);
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
				console.log("ArrowUp");
				this.ship.velocity++;
				// Ship should accellerate
				break;
			}
			case "ArrowDown": {
				console.log("ArrowDown");
				this.ship.velocity--;
				// Ship should Decellerate
				break;
			}
			case "ArrowLeft": {
				console.log("ArrowLeft");
				// Ship sould rotate left
				this.ship.rotation = (this.ship.rotation - 1) % 360;
				break;
			}
			case "ArrowRight": {
				console.log("ArrowRight");
				// Ship should rotate right
				this.ship.rotation = (this.ship.rotation + 1) % 360;
				break;
			}
		}
		console.log(this.ship);
	}

	async focusShip() {
		let shipBox: any = $('#shipBox').css(["height", "width", "top", "left"]);
		for (let key in shipBox) {
			shipBox[key] = Number(shipBox[key].replace(/[a-z]/gi, ''));
		}
		
		let angle = ((Math.PI / 180) * (this.ship.rotation)) % 360;

		$('#myShip').css({
			transform: `rotate(${this.ship.rotation}deg)`
		});
		
		$('#shipBox').css({
			top: `${shipBox.top + (Math.cos(angle) * ((this.ship.velocity)))}px`,
			left: `${shipBox.left + (Math.sin(angle) * ((this.ship.velocity)))}px`,
		});

		let stats: any = this.measure();
		$('#gameMap').css({
			top: `-${shipBox.top - ((stats.height * 50) - (shipBox.height / 2))}px`,
			left: `-${shipBox.left - ((stats.width * 50) - (shipBox.width / 2))}px`,
		});
	}

	async showVectorToPlanet() {
		if (!this.navTarget) {
			// Always nav to earth if nothing else is selected.
			this.navTarget = "earth";
		}

		let dest: any = $(`#${this.navTarget}`).css(["top", "left"]);
		for (let key in dest) { dest[key] = Number(dest[key].replace(/[a-z]/gi, '')); }
		let ship: any = $('#shipBox').css(["top", "left"]);
		for (let key in ship) { ship[key] = Number(ship[key].replace(/[a-z]/gi, '')); }

		var angleDeg = Math.atan2(dest.top - ship.top, dest.left - ship.left) * 180 / Math.PI;

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
		for (let key in dest) { dest[key] = Number(dest[key].replace(/[a-z]/gi, '')); }
		let ship: any = $('#shipBox').css(["top", "left"]);
		for (let key in ship) { ship[key] = Number(ship[key].replace(/[a-z]/gi, '')); }
		
		return Math.sqrt(((dest.top - ship.top) ** 2) + ((dest.left - ship.left) ** 2)).toFixed(0);
	}

	async planetMenu(planet) {
		console.log(this.planets[planet]);
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
			p.setAttribute("id", "paragraph")
			menu.append(p);
			$('#paragraph').text(this.planets[planet].flavorText).css({ "background-color": "RGBA(25, 25, 25, 0.75)" });
		}

		// Display the orders screen
		createButton: {
			let button = document.createElement('button');
			button.setAttribute("id", "showOrders");
			button.setAttribute('onclick', 'game.showOrders()');
			menu.append(button);

			let buttonLive = $('#showOrders');
			buttonLive.text("Show Orders");
			buttonLive.css({
				"background-color": "rgba(0,0,0,0)",
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

		createButton: {
			let button = document.createElement('button');
			button.setAttribute("id", "launch");
			button.setAttribute('onclick', 'game.launch()');
			menu.append(button);

			let buttonLive = $('#launch');
			buttonLive.text("Launch");
			buttonLive.css({
				"background-color": "rgba(0,0,0,0)",
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

		// Now I need to zoom to the planet....
	}

	async getOrders() {
		return new Promise((resolve, reject) => {
			$.getJSON("orders", {}, resolve)
		});
	}

	async showOrders() {
		this.getOrders().then((data) => {
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
					"background-color": "rgba(0,0,0,0)",
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
		}).catch((err) => {
			console.log("044c4b90-096c-5ff7-8e5b-cd290549d94b");
			alert("Error in console");
			console.error(err);
		});
	}

	async showStock() {
		// A shop screen where the player can buy goods to fill orders
		// Should also show what the ship has onboard, so we know our stock level and can sell from this screen as well.
		alert("Not implemented yet");
	}

	async outfit() {
		// Allow the player to change the armament of their ship, so they can raid or bounty hunt or pirate.
		alert("Not implemented yet");
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
		// 	alert(`The game encountered an error: ${JSON.stringify(err)}`)
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

		for (let index in this.planets) {
			let planet = this.planets[index];
			let img = document.createElement('img');
			img.setAttribute("id", index);
			img.setAttribute('src', planet.img)
			$('#gameMap').append(img);
		}
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

	measure() {
		let div: any = document.createElement('div');
		div.setAttribute("id", "measure");
		$('#gameMap').append(div);
		let measure = $('#measure');
		let stats: any = measure.css({
			height: "1vh",
			width: "1vw",
		}).css(["height", "width"]);

		stats.height = Number(stats.height.replace(/[a-z]/gi, '')).toString();
		stats.width = Number(stats.width.replace(/[a-z]/gi, '')).toString();

		measure.remove();
		return stats;
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
			$('#volumeText').text(this.soundElem.volume);
			console.log("Volume", this.soundElem.volume);
		} catch (e) {
			// Do nothing, we just tried to adjust the volume too far
		}
	}

	async MusicVolumeUp() {
		try {
			this.soundElem.volume += 0.05
			$('#volumeText').text(this.soundElem.volume);
			console.log("Volume", this.soundElem.volume);
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
			$('#nowPlaying').text(this.musicList[this.musicTrack]);
			soundElem.play();
			this.soundElem = soundElem;
		}
	}
}

$().ready(() => {
	// Export the game object to the global so it can be accessed.
	Object.assign(global, {
		game: new game()
	});
});