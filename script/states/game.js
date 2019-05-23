const State = require('../state');
// commented out STATES, assuming we'd need this later...
// const { STATES } = require('../stateFactory');
const Bee = require('../gameObjects/bee');
const Insect = require('../gameObjects/insect');
const Player = require('../gameObjects/player');

const MAX_FLIES = 10;
const MAX_BEES = 2;

class Game extends State {

    constructor(args) {
        super(args);

        this.flies = [];
        this.bees = [];

        this.player = new Player(800, 800);
    }

    update(dt, keys) {
        if (this.flies.length < MAX_FLIES) { this.flies.push(new Insect); }

        if (this.bees.length < MAX_BEES) { this.bees.push(new Bee); }

        this.player.update(keys, this.frame, this.flies, this.bees);

        this.flies.forEach(fly => fly.update(this.player));
        this.bees.forEach(bee => bee.update(this.player));
        
        super.update();
    }

    draw() {
        // draw player
        this.player.draw(this.renderer, this.frame);
        
        // draw flies
        this.flies.forEach(fly => {
            fly.draw(this.renderer, this.frame);
        });
        
        // draw flies
        this.bees.forEach(bee => {
            bee.draw(this.renderer, this.frame);
        });
    }
}

module.exports = Game;