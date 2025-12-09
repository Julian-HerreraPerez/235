let spawnLine = 25;
let spawnRate = 1500;
let spawnRateOfDescent = 0.50;
let lastSpawn = -1;
let objects = [];
let gameArea = document.getElementById("gamearea");
let player = document.getElementById("player");

requestAnimationFrame(animate);

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }

    let x = parseInt(player.style.left) || 0;
    let area = document.getElementById("gamearea");

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

    let element = document.createElement("div");
    element.classList.add("object");
    element.style.background = randomObject;


    let xPosition = Math.random() * (gameArea.clientWidth - 30) + 15;

    element.style.left = xPosition + "px";
    element.style.top = spawnLine + "px";

    gameArea.appendChild(element);

    objects.push({
        type: randomObject,
        element: element,
        x: xPosition,
        y: spawnLine
    });
}

function animate() {
    let now = Date.now();

    if (now > lastSpawn + spawnRate) {
        lastSpawn = now;
        spawnRandomObject();
    }

    for (let i = 0; i < objects.length; i++) {
        let currentObject = objects[i];
        currentObject.y += spawnRateOfDescent;
        currentObject.element.style.top = currentObject.y + "px";
    }


    requestAnimationFrame(animate);
}

function collisionDetection() {

}