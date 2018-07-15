class Random {
    constructor(seed = Random.int(1000)) {
        this.seed = seed;
        this.nextNextGaussian;
        this.haveNextNextGaussian = false;
    }

    random() {
        let x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    nextInt(num) {
        return Math.floor(this.random() * num);
    }

    nextFloat() {
        return this.random();
    }

    nextBoolean() {
        return this.random() >= 0.5;
    }
    nextGaussian() {
        if (this.haveNextNextGaussian) {
            this.haveNextNextGaussian = false;
            return this.nextNextGaussian;
        } else {
            let v1, v2, s;
            do {
                v1 = 2 * this.nextFloat() - 1;   // between -1.0 and 1.0
                v2 = 2 * this.nextFloat() - 1;   // between -1.0 and 1.0
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s == 0);
            let multiplier = Math.sqrt(-2 * Math.log(s)/s);
            this.nextNextGaussian = v2 * multiplier;
            this.haveNextNextGaussian = true;
            return v1 * multiplier;
        }
    }

    static int(num) {
        return Math.floor(Math.random() * num);
    }

    static float() {
        return Math.random();
    }

    static boolean() {
        return Math.random() >= 0.5;
    }

    static gaussian() {
        let rand = 0;

        for (let i = 0; i < 6; i += 1) {
            rand += Math.random();
        }

        return rand / 6;
    }
}
var random = new Random();