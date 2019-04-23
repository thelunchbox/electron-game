const State = require('../state');
const { STATES } = require('../stateFactory');

const SPEED = 10;

class Game extends State {

    constructor(args) {
        super(args);

        this.player = {
            x: 800,
            y: 800,
            dir: 1,
        };
    }

    update(dt, keys) {
        if (keys.includes(38)) {
            this.player.y -= SPEED;
        } else if (keys.includes(40)) {
            this.player.y += SPEED;
        }

        if (keys.includes(37)) {
            this.player.x -= SPEED;
            this.player.dir = -1;
        } else if (keys.includes(39)) {
            this.player.x += SPEED;
            this.player.dir = 1;
        }
        console.log(this.player);
    }

    draw(renderer) {
        const { x, y, dir } = this.player;

        renderer.isolatePath(() => {
            renderer.translate(x, y);
            renderer.scale(dir, 1);
            renderer.drawSprite('frog', -40, -40, 80, 80);
        });
    }
}

module.exports = Game;