const { GAME_CONSTANTS, INSECT_CONSTANTS, PLAYER_CONSTANTS } = require ('../constants');

const { GAME_HEIGHT, GAME_WIDTH } = GAME_CONSTANTS;
const { INSECT_SIZE, INSECT_SPEED } = INSECT_CONSTANTS;
const { TONGUE_TIP_SIZE } = PLAYER_CONSTANTS;

class Insect {
    constructor() {
        this.x = Math.random() * GAME_WIDTH;
        this.y = Math.random() * GAME_HEIGHT;
        this.target = {
            x: Math.random() * GAME_WIDTH,
            y: Math.random() * GAME_HEIGHT,
        };
        this.trapped = false;
    }

    update(insect, player) {
        const { x, y, dir, tongue } = player;
        if (tongue.active) {
            const tongueX = x + dir * (tongue.length * Math.cos(-Math.PI / 4));
            const tongueY = y + (tongue.length * Math.sin(-Math.PI / 4));
            const diffX = Math.abs(insect.x - tongueX);
            const diffY = Math.abs(insect.y - tongueY);
            // did we eat an insect?
            if (diffX <= TONGUE_TIP_SIZE + INSECT_SIZE + 2 * INSECT_SPEED && diffY <= TONGUE_TIP_SIZE + INSECT_SIZE + 2 * INSECT_SPEED) {
                // yup
                insect.trapped = true;
            }
        }

        if (insect.trapped) {
            insect.x = x + dir * (tongue.length * Math.cos(-Math.PI / 4)) + dir * 33;
            insect.y = y + (tongue.length * Math.sin(-Math.PI / 4)) - 23;
        } else if (insect.target) {
            const diffX = Math.abs(insect.x - insect.target.x);
            const diffY = Math.abs(insect.y - insect.target.y);
            if (diffX <= INSECT_SPEED && diffY <= INSECT_SPEED) {
                insect.target = {
                    x: Math.random() * GAME_WIDTH,
                    y: Math.random() * GAME_HEIGHT,
                };
            }

            const angle = Math.atan2(insect.target.y - insect.y, insect.target.x - insect.x);
            insect.x += INSECT_SPEED * Math.cos(angle);
            insect.y += INSECT_SPEED * Math.sin(angle);
        }
    }
}

module.exports = Insect;