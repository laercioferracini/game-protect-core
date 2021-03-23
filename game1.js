
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;
debug = false;
//Objects .....................................................................
class Player {
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
        //center
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.arc(this.x, this.y, 1, 0, Math.PI * 2, true);
        this.context.fill();


    }

    update(velocity, e) {
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = 'red';
        //this.context.fillText('*', this.x + velocity.x - 2, velocity.y - this.radius - 5);
        // this.context.moveTo(canvas.width / 2, canvas.height / 2);
        this.context.moveTo(canvas.width / 2, canvas.height / 2 + velocity.y);
        this.context.lineTo(e.clientX, e.clientY);
        this.context.stroke();
        this.context.restore();
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
class Enemy {
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
        //this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.context.fill();

        if (debug) {
            this.context.save();
            this.context.beginPath();
            this.context.font = '15pt arial';

            this.context.fillText(Math.round(this.x) + ':\n' + Math.round(this.y), this.x, this.y - this.radius - 5);
            this.context.restore();
        }

    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
const friction = 0.99;
class Particle {
    constructor(context, x, y, radius, color, velocity) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1
    }

    draw() {
        this.context.save();
        this.context.globalAlpha = this.alpha;
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.context.fill();
        this.context.restore();

        if (debug) {
            this.context.save();
            this.context.beginPath();

            this.context.fillText(Math.round(this.x) + ':\n' + Math.round(this.y), this.x, this.y - this.radius - 5);
            this.context.restore();
        }

    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}
//End .....................................................................

//Instating
const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(c, x, y, 13, 'white');
//array to group the bullets and enemies
const bullets = [];
const enemies = [];
const particles = [];
//const e = new Enemy(c, 300, y, 50, 'green', { x: 0, y: 0 });
//enemies.push(e);
//e.draw();
//Enemies
function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (40 - 4) + 4
        let x;
        let y;
        if (Math.random() < 0.5) {

            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;

        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        }

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const velocity = { x: Math.cos(angle), y: Math.sin(angle) };

        enemies.push(new Enemy(c, x, y, radius, color, velocity));

    }, 1000);

}
let animateId;
function animate() {
    animateId = requestAnimationFrame(animate);
    //clean the frame
    c.fillStyle = 'rgba(0, 0,0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    //c.clearRect(0, 0, canvas.width, canvas.height);
    //draw the player
    player.draw();

    //draw and update the bullets
    bullets.forEach((b, bulletIndex) => {
        b.update();
        if (b.x + b.radius < 0 ||
            b.x - b.radius > canvas.width ||
            b.y + b.radius < 0 ||
            b.y - b.radius > canvas.height
        ) {
            setTimeout(() => {
                bullets.splice(bulletIndex, 1);
            }, 0);
        }
    })
    particles.forEach((p, index) => {
        if (p.alpha <= 0) particles.splice(index, 1);
        else p.update();

    })

    enemies.forEach((enemy, index) => {
        enemy.update();
        const distp = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        //end game
        if (distp - player.radius - enemy.radius + 1 < 1) {
            console.log('Game over!');
            cancelAnimationFrame(animateId);
        }


        bullets.forEach((b, bulletIndex) => {
            const dist = Math.hypot(b.x - enemy.x, b.y - enemy.y);
            if (debug) console.log('dist:' + dist + '|Bx:' + b.x + ' By:' + b.y + '|' + 'Ex:' + enemy.x + ' Ey:' + enemy.y);

            //Verifying colision on enemy
            if (dist - enemy.radius - b.radius < 0.0001) {
                console.info('removed from sreen:' + Number.parseFloat(dist - enemy.radius - b.radius));

                for (let i = 0; i < enemy.radius; i++) {
                    particles.push(new Particle(c,
                        b.x,
                        b.y,
                        Math.random() * 2,
                        enemy.color,
                        { x: Math.random() - 0.5, y: Math.random() - 0.5 })
                    )
                }
                if (enemy.radius - 10 > 5) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });

                    setTimeout(() => {

                        bullets.splice(bulletIndex, 1);
                    }, 0);
                } else {


                    setTimeout(() => {
                        enemies.splice(index, 1);
                        bullets.splice(bulletIndex, 1);
                    }, 0);
                }
            }
        });
    });


}

//mousemove
addEventListener('mousemove', event => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);

    const velocity = { x: Math.cos(angle) * 6, y: Math.sin(angle) * 5 };
    //player.update(velocity, event);


});

addEventListener('click', (event) => {
    //console.log(bullets);
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);

    const velocity = { x: Math.cos(angle) * 6, y: Math.sin(angle) * 6 };

    bullets.push(new Bullets(c, x, y, 5, 'red', velocity));
    player.update(velocity, event);
})

animate();
spawnEnemies();