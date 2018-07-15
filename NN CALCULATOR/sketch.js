


let brain = new NeuralNetwork(2,20,1);


function train(){
    let inputs = [];
    inputs[0] = 1/Math.floor(random(100)+1);
    inputs[1] = 1/Math.floor(random(100)+1);

    let result = 1/(1/inputs[0] + 1/inputs[1]);
    brain.train(inputs,[result]);
    console.log(1/inputs[0],1/inputs[1],1/result);
    console.log(1/inputs[0],1/inputs[1],1/brain.predict(inputs)[0]);
}

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent('canvascontainer');
}

function draw() {
    train();
    return;
    background(0);
    fill(255);
    textSize(32);
    text('word', 10, 30);
}
