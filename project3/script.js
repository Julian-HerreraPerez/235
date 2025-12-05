const dx = 100;
let x = 480 / 2;

window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return;
        }
        

        let player = document.querySelectorAll("#player");

         switch (event.key) {
            case "ArrowLeft":
                x-=dx;
                player.x = x;
                break;
            case "ArrowRight":
                x+=dx;
                player.x = x;
                break;
        }
    })