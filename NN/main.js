let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");
let WIDTH = canvas.width = 1920/2;
let HEIGHT = canvas.height = 1080/2;

let POPULATION = 100;

let allBugs = []
let bugs = [];
let bullets = [];
let numGen = 0;
let ticks = 0;


function addBullet(bug) {
    bullets.push(new Bullet(bug));
}

function addBugs(nb) {
    for (let i = 0; i < nb; i++) {
        let bug = new Bug();
        bugs.push(bug);
        allBugs.push(bug);
    }
}

function INIT() {
    addBugs(POPULATION);
}

function TICK() {
    ticks++;
    if (bugs.length / POPULATION < 0.1 || ticks>600) {
        nextGeneration();
    }
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].deleted) {
            bullets.splice(i, 1);
            continue;
        }
        bullets[i].tick();
    }
    for (let i = 0; i < bugs.length; i++) {
        if (bugs[i].deleted) {
            bugs.splice(i, 1);
            continue;
        }
        bugs[i].think(bugs, bullets);
        bugs[i].tick();
    }
}

function RENDER() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (bullet of bullets) {
        bullet.render(ctx);
    }
    for (bug of bugs) {
        bug.render(ctx);
    }
}


function LOOP() {
    TICK();
    RENDER();
}

function RUN() {
    INIT();
    while (numGen < 0)
        TICK();
    setInterval(function () {
        LOOP();
    }, 1000 / 60);
}

RUN();