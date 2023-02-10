const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const GAME_CONTEXT = {
	isJustLoaded: true,
};

const levels = {
	'01': require('./level_01/level_01.js'),
};

app.get('/', async (req, res) => {
	console.log(`Received ${req.method} request for ${req.path}`);
	
	const inpMessage = req?.query?.msg?.toLowerCase();
	if (Object.keys(req.query).length > 0) {
		console.log(JSON.stringify(req.query, null, 2));
		console.log(`Current page:  ${GAME_CONTEXT.currentPage}`);
		console.log(`Input message: ${inpMessage}`);
	}
	
	let pageToLoad;
	
	if (GAME_CONTEXT.isJustLoaded) {
		// === Initial page ===
		
		GAME_CONTEXT.isJustLoaded = false;
		GAME_CONTEXT.currentPage = 'splash';
		pageToLoad = await fs.readFile('./views/menu/splash_page.txt', 'utf8');
	} else if (inpMessage === 'goto main menu') {
		// === goto main menu ===
		
		GAME_CONTEXT.currentPage = 'main_menu';
		pageToLoad = await fs.readFile('./views/menu/main_menu.txt', 'utf8');
	} else if (GAME_CONTEXT.currentPage === 'splash') {
		// === load menu from splash page ===
		
		if (inpMessage === 'start') {
			GAME_CONTEXT.currentPage = 'main_menu';
			pageToLoad = await fs.readFile('./views/menu/main_menu.txt', 'utf8');
		} else {
			pageToLoad = await fs.readFile('./views/menu/splash_page_repeat.txt', 'utf8');
		}
	} else if (GAME_CONTEXT.currentPage === 'rules_p1') {
		// === rules p1 ===
		
		if (inpMessage === 'next') {
			GAME_CONTEXT.currentPage = 'rules_p2'
			pageToLoad = await fs.readFile('./views/menu/rules_p2.txt', 'utf8');
		} else {
			pageToLoad = await fs.readFile('./views/menu/rules_p1.txt', 'utf8');
		}
	} else if (GAME_CONTEXT.currentPage === 'rules_p2') {
		// === rules p2 ===
		
		if (inpMessage === 'next') {
			GAME_CONTEXT.currentPage = 'main_menu'
			pageToLoad = await fs.readFile('./views/menu/main_menu.txt', 'utf8');
		} else {
			pageToLoad = await fs.readFile('./views/menu/rules_p2.txt', 'utf8');
		}
	} else if (GAME_CONTEXT.currentPage === 'in game') {
		// === execute game logic ===
		
		pageToLoad = await fs.readFile(
				levels[GAME_CONTEXT.currentLevel].findPage(GAME_CONTEXT, inpMessage),
				'utf8'
		);
		
	} else if (GAME_CONTEXT.currentPage === 'main_menu') {
		// === main menu options ===
		
		if (inpMessage === 'rules') {
			GAME_CONTEXT.currentPage = 'rules_p1'
			pageToLoad = await fs.readFile('./views/menu/rules_p1.txt', 'utf8');
		} else if (inpMessage === 'new game') {
			GAME_CONTEXT.currentPage = 'in game';
			GAME_CONTEXT.currentLevel = '01';
			GAME_CONTEXT.currentStep = '01';
			pageToLoad = await fs.readFile('./level_01/views/step_01.txt', 'utf8');
		} else if (inpMessage === 'load') { // TODO: finish implementing
			
		} else {
			
		}
		
	} else {
		GAME_CONTEXT.currentPage = 'main_menu';
		pageToLoad = await fs.readFile('./views/menu/main_menu.txt', 'utf8');
	}
	
	if (!pageToLoad) {
		console.log('no page to load!');
	}
	
	res.send(pageToLoad);
});

const server = app.listen(8000, '192.168.1.41', () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log(`App listening for requests at http://${host}:${port}`);
	
	console.log(server.address());
});
