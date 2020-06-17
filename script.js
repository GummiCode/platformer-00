const player = {
	x: 25,
	y: 10,
	velocity_x: 0,
	velocity_y: 0,
	jump: true,
	height: 20,
	width: 20
};

const setPlayerDefault = () => {
	player.x = 25,
	player.y = 10,
	player.velocity_x = 0,
	player.velocity_y = 0,
	player.jump = true,
	player.height = 20,
	player.width = 20
};

const arrowKeys = {
	right: false,
	left: false,
	jump: false,
}

const canvasParams = {
	fillColor: "lightYellow",
	origin_x: 0,
	origin_y: 0,
	height: 500,
	width: 500,
}

let gravity = 0.6;
const friction = 0.7;
let dodgerSpeed = 0.1;

const keyDown = (key) => {
	if (key.keyCode === 37) {arrowKeys.left = true};
	if (key.keyCode === 39) {arrowKeys.right = true};
	if (key.keyCode === 38) { 
		if(player.jump === false) {
			player.velocity_y = -10;
		}
	}
};

const keyUp = (key) => {
	if (key.keyCode === 37) {arrowKeys.left = false};
	if (key.keyCode === 39) {arrowKeys.right = false};
	if (key.keyCode === 38) {
		if (player.velocity_y < -2) {
			player.velocity_y = -3;
		}
	}
};

let numPlatforms = 5;

let platforms = [];
let dodgers = [];

const renderCanvas = () => {
	ctx.fillStyle = `${canvasParams.fillColor}`;
	ctx.fillRect(canvasParams.origin_x, canvasParams.origin_y, canvasParams.height, canvasParams.width);
};

const renderPlayer = () => {
	ctx.fillStyle = "#F08080";
	ctx.fillRect((player.x)-20, (player.y)-20, player.width, player.height);
};

let currentPlatformY = 250;

const createPlatforms = () => {
	for (i=0; i<numPlatforms; i++) {
		currentPlatformY += ((Math.floor(Math.random() * 150)) - 75);
		if (currentPlatformY < 485 && currentPlatformY > 100) { 
			platforms.push(
				{
					x: 100 * i,
					y: currentPlatformY,
					width: 50,
					height: 15,
				}
			);
			if ((Math.floor(Math.random() * 2) > 0) && platforms.length > 1) {
				dodgers.push(
					{
						x: (100 * i) + (platforms[i].width / 3),
						y: currentPlatformY + 25,
						origin_y: currentPlatformY,
						velocity_x: 0,
						velocity_y: 0,
						width: 15,
						height: 15,
					}
				)
			};
		} else {
			currentPlatformY = 425;
			platforms.push(
				{
					x: 100 * i,
					y: currentPlatformY,
					width: 50,
					height: 15,
				}
			);
		};		
	}
};

const renderPlatforms = () => {
	ctx.fillStyle = "#45597E";
	platforms.forEach(platform => ctx.fillRect(platform.x, platform.y, platform.width, platform.height));
}

const renderFireworks = () => {
	fireworks.forEach(firework => {
		ctx.fillStyle = firework.color;
		ctx.fillRect(firework.x, firework.y, firework.width,firework.height);
	});
};

const goalParams = {};

const renderGoal = (finalPlatformY) => {
	goalParams.top = finalPlatformY - 130;
	goalParams.bottom = finalPlatformY - 50;
	ctx.fillStyle = "#80e080";
	ctx.fillRect(490, (finalPlatformY - 50), 10, 15);
	ctx.fillRect(490, (finalPlatformY - 130), 10, 15);
}

const renderDodgers = () => {
	ctx.fillStyle = "#000000";
	dodgers.forEach(dodger => ctx.fillRect(dodger.x, dodger.y, dodger.width, dodger.height));
}

const numFireworks = 5;
const fireworks = [];

const fireworkColorGenerator = () => {
	const figures = '0123456789ABCDEF';
	let randomFireworkColor = '#';
	for (i = 0; i < 6; i++) {
	  randomFireworkColor += figures[Math.floor(Math.random() * 16)];
	}
	return randomFireworkColor;
};

const createFireworks = () => {
	for (i=0; i<numFireworks; i++) {
		fireworks.push(
			{
			x: 245,
			y: 245,
			width: 10,
			height: 10,
			velocity_x: -12 + Math.floor(Math.random() * 24),
			velocity_y: Math.floor(Math.random() * -20),
			color: fireworkColorGenerator(),
			}
		)
	};
};

const gameLoop = () => {
	if(arrowKeys.right) {
		player.x += 2.5;
	};

	if(arrowKeys.left) {
		player.x += -2.5;
	};

	if(player.jump === false) {
		player.velocity_x *= friction;	
	} else {
		if (player.velocity_y < 10) {
			player.velocity_y += gravity
		} else {
			player.velocity_y = 10
		};
	};
	player.jump = true;

	player.y += player.velocity_y;
	player.x += player.velocity_x;

	const dodgerController = (dodgerElem) => {
		if(dodgerElem.y > dodgerElem.origin_y) {
			dodgerElem.velocity_y -= dodgerSpeed
		} else {
			dodgerElem.velocity_y += dodgerSpeed
		};

		dodgerElem.y += dodgerElem.velocity_y;
	};

	dodgers.forEach(dodgerController);
	
	let currentPlatform = -1;

	const platformCheck = (platformElem, platformIndex) => {
		if(platformElem.x-2.5 < player.x && player.x < platformElem.x + platformElem.width + 22.5 &&
		platformElem.y < player.y && player.y < platformElem.y + platformElem.height) {
			currentPlatform = platformIndex;
		}
	};

	platforms.forEach(platformCheck);

	if (currentPlatform > -1){
		player.jump = false;
		player.y = platforms[currentPlatform].y;    
	}

	let currentDodger = -1;

	const dodgerCheck = (dodgerElem, dodgerIndex) => {
		if(  player.x > dodgerElem.x && player.x < dodgerElem.x + 35 &&
		player.y > dodgerElem.y && player.y < dodgerElem.y + 30) {
			currentDodger = dodgerIndex;
		}
	}

	dodgers.forEach(dodgerCheck);

	if (currentDodger > -1) {
		setPlayerDefault();
	};

	const fallCheck = () => {
		if (player.y > canvasParams.height + 20 || player.x < canvasParams.origin_x || (player.x > canvasParams.width + 20 && player.y < goalParams.top - 30) || (player.x >canvasParams.width + 20 && player.y > goalParams.bottom + 30)) { // TODO: Need to add a clause for falls off the right of the screen and not within the goal markers.
			setPlayerDefault();
		}
	};

	fallCheck();

	const winCheck = () => {
		if (player.x > canvasParams.width + 20 && player.y > goalParams.top - 30 && player.y < goalParams.bottom + 30) {
			createFireworks()
		}
	};

	winCheck();

	const fireworksController = fireworkElem => {
		fireworkElem.velocity_y += gravity;
		fireworkElem.y += fireworkElem.velocity_y;
		fireworkElem.x += fireworkElem.velocity_x;
	};

	fireworks.forEach(fireworksController);

	renderCanvas();
	renderPlayer();
	renderPlatforms();
	renderDodgers();
	renderGoal(currentPlatformY);
	renderFireworks();

} 

const buttonTextFlash = (buttonName) => {
	buttonName.style.color = "#E0E0E0";
	buttonName.style.transition = "color 0.2s linear";
	
	setTimeout(() => {
		buttonName.style.color = "unset";
		buttonName.style.transition = "color 0.2s linear";
	}, 300);
};

const retryButton = document.querySelector("#retry");
const newLevelButton = document.querySelector("#new-level");

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.canvas.height = canvasParams.height;
ctx.canvas.width = canvasParams.width;
createPlatforms();
document.addEventListener("keyup", keyUp);
document.addEventListener("keydown", keyDown);
retryButton.addEventListener("click", () => {
	setPlayerDefault();
	buttonTextFlash(retryButton);
});
newLevelButton.addEventListener("click", () => {
	platforms = [];
	dodgers = [];
	gravity = 0;
	setPlayerDefault();
	gravity = 0.6;
	createPlatforms();
	buttonTextFlash(newLevelButton);
});

setInterval(gameLoop, 20);

/*
TODO:
0. Check that canvas elements, esp. fireworks, are clearing. MAy eb sensible to add a setTimeout to clear the fireworks after 5s.
1 - DONE - Improve the retry button.
2. -DONE- Make a collision detector for the dodgers.
3. -DONE- Program the result of the dodger collison detecor. Suggest returning the player to the starting position. 
4. -DONE- Add a goal. I suggest a green or light blue marker at the right of the screen a set height above the final platform; the player jumps through this to 'win'.
5. -DONE- Add a detector for falling off the level, and a fall condition.
5. -DONE- Add a detector for 'win'. It will be the player passing through the goal.
6. -DONE-Add a win animation! Can we do fireworks? I bet we can! Also atext 'you win!' in pixel text, and a 'try again? button which uses an event listener.
6B. TODO: Update the firework controller so that rather than dispersing fireworks while theplayer is in the in area, it instead launches a set number of particles 'simultaneously' when the player enters the win area. To rephrase, alter the win condition detector to activate once when the player enters the area then not activate again for a short time. Also make it return the player to the start position, or erase the player.
7. Add a counter for the number of wins.
8. Add a nice animation for fail events eg. dodger collisions  falls.
9. Refactor! In particular, move a lot of functions out of the game loop! Also sort them into a sensible order.
10. Do we want to move different functions into different JS documents? Good modular practice...
*/