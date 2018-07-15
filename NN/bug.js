function mutate(x) {
    if (random.nextFloat() < 0.1) {
        let offset = random.nextGaussian() * 0.5;
        let newx = x + offset;
        return newx;
    } else {
        return x;
    }
}

class Bug {
    constructor(brain) {
        this.x = Math.floor(Math.random() * WIDTH);
        this.y = Math.floor(Math.random() * HEIGHT);
        this.r = 5;
        this.angle = 45;
        this.ticks = 0;
        this.speed = 2;
        this.distMax = 0;
        this.vA = 75;
        this.shootDelay = 0;
        this.shootDelayMax = 50;
        this.viewBullets = [];
        this.viewBugs = [];
        this.deleted = false;
        this.kill = 0;
        this.touch = 0;
        this.fitness = 0;
        this.setFov(0);

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(mutate);
        } else {
            this.brain = new NeuralNetwork(7, 16, 3);
        }

    }

    setFov(num){
        let vAmax  = 75, vAmin = 10, vDmax = 200, vDmin = 50;
        this.vA+=num;
        if(this.vA>75)this.vA=75;
        if(this.vA<10)this.vA=10;
        this.distMax = (((vAmax - vAmin) - (this.vA - vAmin)) / (vAmax - vAmin)) * (vDmax - vDmin) + vDmin;

    }

    get score(){
        if(this.touch===0)
            return this.kill;
        return this.kill/(this.touch*2);
    }

    copy() {
        return new Bug(this.brain);
    }

    setSpeed(nb) {
        this.speed += nb;
        if (this.speed < 0) this.speed = 0;
        if (this.speed > 2) this.speed = 2;
    }

    shoot() {
        if (this.shootDelay > 0) return;
        addBullet(this);
        this.shootDelay = this.shootDelayMax;
    }

    think(bugs, bullets) {
        this.viewBugs = this.checkFov(bugs);
        this.viewBullets = this.checkFov(bullets);

        let inputs = [];
        inputs[0] = this.x/WIDTH;
        inputs[1] = this.y/HEIGHT;
        inputs[2] = this.angle/360;
        inputs[3] = (this.vA-10)/65;
        inputs[4] = (this.viewBugs.length>0)?1:0;
        inputs[5] = (this.viewBullets.length>0)?1:0;
        inputs[6] = (this.shootDelay > 0) ? 0 : 1;

        let action = this.brain.predict(inputs);
        if (action[0] > 0.5) {
            this.angle+=10;
        } else {
            this.angle-=10;
        }

        if (action[1] > 0.5) {
            this.setFov(1);
        } else {
            this.setFov(-1);
        }

        if (action[2] > 0.5) {
            this.shoot();
        }
    }

    tick() {
        this.ticks++;
        if (this.touch > 3) {
            this.deleted = true;
            this.viewBullets = [];
            this.viewBugs = [];
        }
        if (this.shootDelay > 0) this.shootDelay--;
        let vx = Math.cos(this.angle * Math.PI / 180) * this.speed;
        let vy = Math.sin(this.angle * Math.PI / 180) * this.speed;

        this.x += vx;
        this.y += vy;

        if(this.x>WIDTH)this.x = WIDTH;
        if(this.x<0)this.x = 0;

        if(this.y>HEIGHT)this.y = HEIGHT;
        if(this.y<0)this.y = 0;
    }

    checkFov(entities) {
        let ret = [];
        for (let e of entities) {
            if (this === e) continue;
            let dist = Math.hypot(this.x - e.x, this.y - e.y);
            if (e instanceof Bullet) {
                if(this === e.owner) continue;
                if (dist < this.r + e.r && !e.deleted) {
                    this.touch ++;
                    e.owner.kill ++;
                    e.deleted = true;
                }
            }
            if (this.fov(e)) {
                if (dist <= this.distMax)
                    ret.push(e);
            }
        }
        return ret;
    }

    fov(e) {
        let d = (this.angle - this.vA / 2);
        let a = Math.atan2(e.y - this.y, e.x - this.x) * 180 / Math.PI - d;
        let b = this.vA;
        return (a >= 0 && a <= b);
    }

    render(ctx) {
        let size = this.r;
        if (this.speed !== 0) size += Math.cos(this.ticks / this.speed) / 2;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.distMax, (this.angle - this.vA / 2) * Math.PI / 180, (this.angle + this.vA / 2) * Math.PI / 180);
        ctx.lineTo(this.x, this.y);
        var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.distMax);
        grd.addColorStop(0, "rgba(0,0,0,0.1)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();

        let x = this.x + Math.cos(this.angle * Math.PI / 180) * size;
        let y = this.y + Math.sin(this.angle * Math.PI / 180) * size;

        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();

        for (let bug of this.viewBugs) {
            let dist = Math.hypot(this.x - bug.x, this.y - bug.y) + 0.1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(bug.x, bug.y);
            var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.distMax);
            grd.addColorStop(0, "rgba(0,0,0," + (this.distMax / dist - 1) + ")");
            grd.addColorStop(1, "rgba(0,0,0,0)");
            ctx.strokeStyle = grd;
            ctx.stroke();
        }
        for (let bug of this.viewBullets) {
            let dist = Math.hypot(this.x - bug.x, this.y - bug.y) + 0.1;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(bug.x, bug.y);
            var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.distMax);
            grd.addColorStop(0, "rgba(0,0,0," + (this.distMax / dist - 1) + ")");
            grd.addColorStop(1, "rgba(0,0,0,0)");
            ctx.strokeStyle = grd;
            ctx.stroke();
        }

    }
}

function collision(c1, c2) {
    let dx = c1.x - c2.x;
    let dy = c1.y - c2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < c1.r + c2.r)
        return true
    return false;
}