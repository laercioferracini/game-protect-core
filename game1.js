const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
//Objects .....................................................................
class Player {
    constructor(context, x, y, radius, color) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.context.fill();
        //center
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.arc(this.x, this.y, 1, 0, Math.PI * 2, true);
        this.context.fill();
    }

    update() {

    }
}



//End .....................................................................

//Instating
const x = canvas.width / 2;
const y = canvas.height / 2;
const p = new Player(c, x, y, 30, 'white');

//draw the player
p.draw();

