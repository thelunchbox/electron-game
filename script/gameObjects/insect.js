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

    update(player) {
        const { x, y, dir, tongue } = player;
        if (tongue.active) {
            const tongueX = x + dir * (tongue.length * Math.cos(-Math.PI / 4));
            const tongueY = y + (tongue.length * Math.sin(-Math.PI / 4));
            const diffX = Math.abs(this.x - tongueX);
            const diffY = Math.abs(this.y - tongueY);
            // did we eat an insect?
            if (diffX <= TONGUE_TIP_SIZE + INSECT_SIZE + 2 * INSECT_SPEED && diffY <= TONGUE_TIP_SIZE + INSECT_SIZE + 2 * INSECT_SPEED) {
                // yup
                this.trapped = true;
            }
        }

        if (this.trapped) {
            this.x = x + dir * (tongue.length * Math.cos(-Math.PI / 4)) + dir * 33;
            this.y = y + (tongue.length * Math.sin(-Math.PI / 4)) - 23;
        } else if (this.target) {
            const diffX = Math.abs(this.x - this.target.x);
            const diffY = Math.abs(this.y - this.target.y);
            if (diffX <= INSECT_SPEED && diffY <= INSECT_SPEED) {
                this.target = {
                    x: Math.random() * GAME_WIDTH,
                    y: Math.random() * GAME_HEIGHT,
                };
            }

            const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            this.x += INSECT_SPEED * Math.cos(angle);
            this.y += INSECT_SPEED * Math.sin(angle);
        }
    };

    draw(renderer, frame) {
        renderer.isolatePath(() => {
            renderer.translate(this.x, this.y);
            renderer.strokeAndFillCircle(0, 0, INSECT_SIZE);
            renderer.path(() => {
                renderer.oscillateText('buzz', INSECT_SIZE, 0, frame * 2, { amplitude: 10, outline: false });
            }, {
                fillStyle: '#fff',
                textAlign: 'left',
            });
            renderer.path(() => {
                renderer.oscillateText('buzz', -INSECT_SIZE, 0, frame * 2, { amplitude: 10, reverse: true, outline: false });
            }, {
                fillStyle: '#fff',
                textAlign: 'right',
            });
        }, {
            lineWidth: 4,
            strokeStyle: '#fff',
            fillStyle: this.trapped ? '#f00' : '#000',
        });
    };
}

module.exports = Insect;
