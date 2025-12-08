


window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return;
        }
        

        let player = document.getElementById("player");
        let x = parseInt(player.style.left) || 0;
        let area = document.getElementById("gamearea");

        let pWidth = player.offsetWidth;
        let aWidth = area.clientWidth/2;
  


         switch (event.key) {
            case "ArrowLeft":
                x -= 5;
                break;
            case "ArrowRight":
                x+=5;
                break;
        }


        x = Math.max(-aWidth, Math.min(x, aWidth));
        player.style.left= x + "px";
    })