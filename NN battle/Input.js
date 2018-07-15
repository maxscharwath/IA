class Input {
    constructor() {
        let $this = this;
        this.keys = [];
        /* Action keys */
        this.up = new Key(this);
        this.down = new Key(this);
        this.left = new Key(this);
        this.right = new Key(this);
        this.attack = new Key(this);
        this.menu = new Key(this);
        this.enter = new Key(this);
        this.inventory = new Key(this);

        this.num0 = new Key(this)
        this.num1 = new Key(this);
        this.num2 = new Key(this);
        this.num3 = new Key(this);
        this.num4 = new Key(this);
        this.num5 = new Key(this);
        this.num6 = new Key(this);
        this.num7 = new Key(this);
        this.num8 = new Key(this);
        this.num9 = new Key(this);

        this.debug = new Key(this);

        this.save = new Key(this);

        window.addEventListener("keydown", function(event){$this.toggle(event,true)},false);
        window.addEventListener("keyup", function(event){$this.toggle(event,false)},false);
    }
    releaseAll() {
        for (let i = 0; i < this.keys.length; i++) {
            this.keys[i].down = false;
        }
    }

    tick() {
        for (let i = 0; i < this.keys.length; i++) {
            this.keys[i].tick();
        }
    }

    toggle(k, pressed){
        if(k.keyCode === 38) this.up.toggle(pressed);
        if(k.keyCode === 40) this.down.toggle(pressed);
        if(k.keyCode === 37) this.left.toggle(pressed);
        if(k.keyCode === 39) this.right.toggle(pressed);

        if(k.keyCode === 87) this.up.toggle(pressed);
        if(k.keyCode === 83) this.down.toggle(pressed);
        if(k.keyCode === 65) this.left.toggle(pressed);
        if(k.keyCode === 68) this.right.toggle(pressed);

        if(k.keyCode === 32) this.attack.toggle(pressed);

        if(k.keyCode === 13) this.enter.toggle(pressed);

        if(k.keyCode === 73) this.inventory.toggle(pressed);

        if(k.keyCode === 48 || k.keyCode === 96) this.num0.toggle(pressed);
        if(k.keyCode === 49 || k.keyCode === 97) this.num1.toggle(pressed);
        if(k.keyCode === 50 || k.keyCode === 98) this.num2.toggle(pressed);
        if(k.keyCode === 51 || k.keyCode === 99) this.num3.toggle(pressed);
        if(k.keyCode === 52 || k.keyCode === 100) this.num4.toggle(pressed);
        if(k.keyCode === 53 || k.keyCode === 101) this.num5.toggle(pressed);
        if(k.keyCode === 54 || k.keyCode === 102) this.num6.toggle(pressed);
        if(k.keyCode === 55 || k.keyCode === 103) this.num7.toggle(pressed);
        if(k.keyCode === 56 || k.keyCode === 104) this.num8.toggle(pressed);
        if(k.keyCode === 57 || k.keyCode === 105) this.num9.toggle(pressed);

        if(k.keyCode === 112) this.save.toggle(pressed);
        if(k.keyCode === 114) this.debug.toggle(pressed);

        k.preventDefault();
        //console.log(event.keyCode,pressed);
    }
}

class Key {
    constructor(input) {
        input.keys.push(this);
        this.presses = 0;
        this.absorbs = 0;
        this.down = 0;
        this.clicked = 0;
    }

    toggle(pressed) {
        if (pressed != this.down) {
            this.down = pressed; //If the key is being pressed, then down is true.
        }
        if (pressed) {
            this.presses++; //If pressed, then presses value goes up.
        }
    }

    tick() {
        if (this.absorbs < this.presses) { //if presses are above absorbs
            this.absorbs++;//increase the absorbs value
            this.clicked = true;//clicked is true
        } else {
            this.clicked = false;//else clicked is false
        }
    }
}