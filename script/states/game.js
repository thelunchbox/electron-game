const State = require('../state');
const { STATES } = require('../stateFactory');

class Game extends State {

    update(dt, keys) {
        console.log(keys);
    }

    draw(renderer) {
    }
}

module.exports = Game;