const spawnLine = 25;
const maxY = 850;
const spawnRate = 1500;
const spawnRateOfDescent = 0.75;
let lastSpawn = -1;
const objects = [];
let animationId;
const gameArea = document.getElementById("gamearea");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");

let score = 0;
let savedHighScore = 0;

document.addEventListener('DOMContentLoaded', function () {
    let highScore = document.getElementById("highScore");

    const saved = localStorage.getItem('HighScore');
    if (saved) {
        savedHighScore = parseInt(saved);
        highScore.innerHTML = "HighScore: " + savedHighScore;
    }
})


requestAnimationFrame(animate);


window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }

    let x = parseInt(player.style.left) || 0;
    let area = document.getElementById("gamearea");

    if (!area) {
        return;
    }

    let aWidth = area.clientWidth / 2;



    switch (event.key) {
        case "ArrowLeft":
            x -= 5;
            break;
        case "ArrowRight":
            x += 5;
            break;
    }


    x = Math.max(-aWidth, Math.min(x, aWidth));
    player.style.left = x + "px";
})

function spawnRandomObject() {
    let randomObject;
    if (Math.random() < 0.5) {
        randomObject = "red";
    }
    else {
        randomObject = "blue";
    }

    let element = document.createElement("img");
    element.classList.add("object");
    if (randomObject == "red") {
        element.src = "oil.png";
    }
    else {
        element.src = "jerrycan.png";
    }


    let xPosition = Math.random() * (gameArea.clientWidth - 30) + 15;

    element.style.left = xPosition + "px";
    element.style.top = spawnLine + "px";

    gameArea.appendChild(element);

    objects.push(new spawningObjects(randomObject, element, xPosition, spawnLine));
}

function animate() {
    animationId = requestAnimationFrame(animate);

    let now = Date.now();
    if (now > lastSpawn + spawnRate) {
        lastSpawn = now;
        spawnRandomObject();
    }

    for (let i = 0; i < objects.length; i++) {
        let currentObject = objects[i];
        currentObject.move(spawnRateOfDescent)

        if (currentObject.y > maxY) {
            objects.splice(i, 1);
            currentObject.element.remove();
            i--;
        }
        if (collisionDetection(currentObject.element, player)) {
            objects.splice(i, 1);
            currentObject.element.remove();
            i--;

            if (currentObject.type == "blue") {
                console.log("blue")
                score++;
                scoreText.textContent = "Score: " + score;
            }
            else if (currentObject.type == "red") {
                gameOver("You hit oil and spun out. Score: " + score)
            }
        }
    }
}

function collisionDetection(gameObj, player) {
    const obj = gameObj.getBoundingClientRect();
    const car = player.getBoundingClientRect();

    return !(obj.bottom < car.top ||
        obj.top > car.bottom ||
        obj.right < car.left ||
        obj.left > car.right
    );
}



function gameOver(message) {
    cancelAnimationFrame(animationId);
    if (score > savedHighScore) {
        localStorage.setItem('HighScore', score);
    }
    document.body.innerHTML = `<h1 id="resetText" style = "color: white; text-align center;">${message}</h1>`
    document.body.innerHTML += `<button id="reset"> Play Again </button>`
    document.getElementById("reset").addEventListener("click", reset);

}

function reset() {
    window.location.reload();
}

class spawningObjects {
    constructor(type, element, x, y) {
        this.type = type;
        this.element = element;
        this.x = x;
        this.y = y;
    }

    move(rate) {
        this.y += rate;
        this.element.style.top = this.y + "px";
    }
}