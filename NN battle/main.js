let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");
let WIDTH = canvas.width = 1920 / 10;
let HEIGHT = canvas.height = 1080 / 10;

let keyEvent = new Input();

let Player = new Bug();
let AI = new Bug();

let bullets = [];
let isTraining = true;


function addBullet(bug) {
    bullets.push(new Bullet(bug));
}

function RENDER() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Player.render(ctx);
    AI.render(ctx);
    for (let bullet of bullets) {
        bullet.render(ctx);
    }
}


function LOOP() {
    Player.setTarget();
    Player.tick();
    if (isTraining)
        AI.train(Player, [Player,AI], bullets);
    AI.think([Player,AI], bullets);
    AI.tick();
    for (let bullet of bullets) {
        bullet.tick();
    }
    RENDER();
}

function RUN() {
    setInterval(function () {
        LOOP();
    }, 1000 / 60);
}

RUN();