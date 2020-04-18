// Setup some constants that exist throughout the game

class game {
	backgroundUrl: string;
	url: { server: string; };
	planets: any;
	constructor() {
		console.log("Starting Game Constructor");

		this.backgroundUrl = "Planets/Textures/8k_stars_milky_way.jpg";

		this.url = {
			server: "ld46-792073873.ap-southeast-2.elb.amazonaws.com"
		}

		this.planets = {
			sun: {
				radius: 695700,
				ratio: 1,
				auRatio: 0,
				img: `Planets/img/sun.jpg`,
			},
			mercury: {
				radius: 2439,
				ratio: 0.0035,
				auRatio: 0.012,
				img: `Planets/img/mercury.jpg`,
			},
			venus: {
				radius: 6051,
				ratio: 0.0086,
				auRatio: 0.024,
				img: `Planets/img/venus.jpg`,
			},
			earth: {
				radius: 6051,
				ratio: 0.0091,
				auRatio: 0.033,
				img: `Planets/img/earth.jpg`,
			},
			mars: {
				radius: 3396,
				ratio: 0.0048,
				auRatio: 0.050,
				img: `Planets/img/mars.jpg`,
			},
			jupiter: {
				radius: 71492,
				ratio: 0.1027,
				auRatio: 0.173,
				img: `Planets/img/jupiter.jpg`,
			},
			saturn: {
				radius: 60268,
				ratio: 0.0866,
				auRatio: 0.318,
				img: `Planets/img/saturn.jpg`,
			},
			uranus: {
				radius: 25559,
				ratio: 0.0367,
				auRatio: 0.638,
				img: `Planets/img/uranus.jpg`,
			},
			neptune: {
				radius: 24764,
				ratio: 0.0355,
				auRatio: 1,
				img: `Planets/img/neptune.jpg`,
			},
		}

		// Setup the game screen - Background etc
		this.background();

		this.showMenu();
	}

	// Connects to the game server and starts actually playing the game
	async joinUniverse() {
		console.log("78fb65e1-69ad-5fea-ac30-407e8aec05a4");
		$('#joinLink').attr('disabled', 'true');
		$('#menu').remove();
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
		let body = $('body');
		let menu;

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

		createHeading: {
			let h1 = document.createElement('h1');
			h1.setAttribute("id", "heading")
			menu.append(h1);
			$('#heading').text("Welcome to Elon-zo");
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

				height: "1cm",
				width: "100%",
				margin: "3px 0px",

				"text-align": "center",
				"font-size": "1.5em",
				color: "goldenrod"
			});
		}
	}

	// Sets up the background of the game
	background() {
		$('body').css({
			background: 'black',
			"background-image": `url("${this.backgroundUrl}")`,
			"background-size": "cover",
			"background-repeat": "repeat",
			position: "absolute",
			top: "0",
			left: "0",
			animation: "mymove 60s linear infinite",

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

				width: "100vw",
				height: "100vh",

				// "background-color": "blue"
			});
		}

		let x = 0;
		for (let index in this.planets) {
			let planet = this.planets[index];
			let img = document.createElement('img');
			img.setAttribute("id", index);
			img.setAttribute('src', planet.img)
			$('#gameMap').append(img);

			$('#' + index).css({
				position: "relative",
				top: "50%",
				left: `${10 * ++x}px`,

				height: `${10 * planet.ratio}cm`,
				width: `${10 * planet.ratio}cm`,
				margin: `0px 0px`,

				"background-color": "red"
			});
		}
	}
}

$().ready(() => {
	// Export the game object to the global so it can be accessed.
	Object.assign(global, {
		game: new game()
	});
});