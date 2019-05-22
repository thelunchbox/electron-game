const { INSECT_CONSTANTS, PLAYER_CONSTANTS } = require('../constants');

const { INSECT_SIZE, INSECT_SPEED } = INSECT_CONSTANTS;
const { RIBBIT_REST, TOUNGUE_TIP_SIZE } = PLAYER_CONSTANTS;

class Player {
    constructor(x, y) {
        this.score = 0,
        this.x = x,
        this.y = y,
        this.dir = 1,
        this.tongue = {
            length: 0,
            active: null,
            frame: 0,
        },
        this.ribbit = {
            cooldown: 0,
            x: null,
            y: null,
        };
    }
}

module.exports = Player;