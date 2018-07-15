class Bullet {
    constructor(owner) {
        this.x = owner.x;
        this.y = owner.y;
        this.r = 3;
        this.angle = owner.angle;
        this.speed = 10;
        this.owner = owner;
        this.ticks = 0;
        this.deleted = false;
    }

    tick() {
        this.ticks++;
        let vx = Math.cos(this.angle * Math.PI / 180) * this.speed;
        let vy = Math.sin(this.angle * Math.PI / 180) * this.speed;
        this.x += vx;
        this.y += vy;
        if(this.ticks>100){
            this.deleted = true;
        }
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
    }
}