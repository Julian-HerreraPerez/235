window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return;
        }
        

        let player = document.getElementById("player");
        let currentX = parseInt(player.style.left) || 0;

         switch (event.key) {
            case "ArrowLeft":
                player.style.left= parseInt(currentX -5) + "px";
                break;
            case "ArrowRight":
                player.style.left= parseInt(currentX +5) + "px";
                break;
        }
    })