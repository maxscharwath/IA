function resetGame() {
    bullets = [];
}

// Create the next generation
function nextGeneration() {
    ticks=0;
    numGen++;
    resetGame();
    // Normalize the fitness values 0-1
    //normalizeFitness(allBugs);
    // Generate a new set of bugs
    bugs = generate(allBugs);
    // Copy those bugs to another array
    allBugs = bugs.slice();
}

// Generate a new population of bugs
function generate(oldBugs) {
    let newBugs = [];
    oldBugs = oldBugs.sort(function(a, b) {
        return b.score - a.score;
    });
    console.log(oldBugs[0].score);
    for (let i = 0; i < oldBugs.length; i++) {
        // Select a bug based on fitness
        let bug = new Bug();
        if(Math.random()<0.1) {
            bug = oldBugs[0].copy();
        }
        newBugs[i] = bug;
    }
    return newBugs;
}

// Normalize the fitness of all bugs
function normalizeFitness(bugs) {
    // Make score exponentially better?

    for (let i = 0; i < bugs.length; i++) {
        bugs[i].score = Math.pow(bugs[i].score, 2);
    }

    // Add up all the scores
    let sum = 0;
    for (let i = 0; i < bugs.length; i++) {
        sum += bugs[i].score;
    }
    // Divide by the sum
    for (let i = 0; i < bugs.length; i++) {
        bugs[i].fitness = bugs[i].score / sum;
    }
}
