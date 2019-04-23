const State = require('../state');
const { STATES } = require('../stateFactory');

class Game extends State {

    constructor(args) {
        super(args);

        this.player = {
            x: 800,
            y: 800,
        };
    }

    update(dt, keys) {
        console.log(keys);
    }

    draw(renderer) {

    }
}

module.exports = Game;