
import { GameManager } from "./GameManager.js";  
import { Image, Renderer } from "p5";

let game: GameManager;
let canvas: Renderer;

// NEW: base game resolution (DO NOT CHANGE YOUR GAME)
const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

export function preload() {
	game = new GameManager();
}

export function setup() {
	frameRate(60);
	canvas = createCanvas(windowWidth, windowHeight);

	canvas.style('display', 'block');
	canvas.style('padding', '0px');
	canvas.style('margin', '0px');
}

export function draw() {
	background(255);

	// NEW: scaling for any window size
	let scaleFactor = min(width / BASE_WIDTH, height / BASE_HEIGHT);

	push();

	scale(scaleFactor);

	// NEW: center the game inside the window
	translate(
		(width / scaleFactor - BASE_WIDTH) / 2,
		(height / scaleFactor - BASE_HEIGHT) / 2
	);

	if (focused) {
		game.update();
	}

	game.draw();

	pop();

	// (REMOVED the broken rect(800,0,width*10,height*10) line)
}

export function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

export function keyPressed() {
	if (key=='m') {
		game.toggleMenu();
	}
	if (keyCode==ESCAPE) {
		game.toggleFullScreen();
	}
}