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

class Bullets {
    constructor(context, x, y, radius, color, velocity) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.context.fill();

    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

//End .....................................................................

//Instating
const x = canvas.width / 2;
const y = canvas.height / 2;
const p = new Player(c, x, y, 30, 'white');
//array to group the bullets
const bullets = [];


function animate() {
    //clean the frame
    c.clearRect(0, 0, canvas.width, canvas.height);
    //draw the player
    p.draw();
    //draw and update the bullets
    bullets.forEach((b) => {
        b.update();
    })

    requestAnimationFrame(animate);
}
//mousemove
addEventListener('click', (event) => {

    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);

    const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

    bullets.push(new Bullets(c, x, y, 5, 'red', velocity));
})

animate();