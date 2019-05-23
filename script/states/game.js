const State = require('../state');
const { STATES } = require('../stateFactory');
const Bee = require('../gameObjects/bee');
const Insect = require('../gameObjects/insect');
const Player = require('../gameObjects/player');

const { GAME_CONSTANTS, PLAYER_CONSTANTS, INSECT_CONSTANTS } = require('../constants');

const { GAME_HEIGHT, GAME_WIDTH } = GAME_CONSTANTS;
const { FROG_SIZE, MAX_INJURY, RIBBIT_REST, SPEED, TONGUE_TIP_SIZE } = PLAYER_CONSTANTS;
const { INSECT_SIZE } = INSECT_CONSTANTS;

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