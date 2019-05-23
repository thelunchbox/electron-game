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
        if (this.flies.length < MAX_FLIES) { this.flies.push(new Fly); }

        if (this.bees.length < MAX_BEES) { this.bees.push(new Bee); }

        this.player.update(keys, this.frame, this.flies, this.bees);

        this.flies.forEach(fly => fly.update(this.player));
        this.bees.forEach(bee => bee.update(this.player));
        super.update();
    }

    drawInsect(insect, type) {
        this.renderer.isolatePath(() => {
            this.renderer.translate(insect.x, insect.y);
            this.renderer.strokeAndFillCircle(0, 0, INSECT_SIZE);
            this.renderer.path(() => {
                this.renderer.oscillateText('buzz', INSECT_SIZE, 0, this.frame * 2, { amplitude: 10, outline: false });
            }, {
                    fillStyle: '#fff',
                    textAlign: 'left',
                });
            this.renderer.path(() => {
                this.renderer.oscillateText('buzz', -INSECT_SIZE, 0, this.frame * 2, { amplitude: 10, reverse: true, outline: false });
            }, {
                    fillStyle: '#fff',
                    textAlign: 'right',
                });
            if (type === 'BEE') {
                this.renderer.isolatePath(() => {
                    this.renderer.rotate(Math.PI / 2);
                    this.renderer.fillText('ouch', INSECT_SIZE, 0);
                }, {
                        font: '8pt Sans',
                        fillStyle: '#F5AF22',
                        textAlign: 'left',
                        textBaseline: 'middle',
                    });
            }
        }, {
                lineWidth: 4,
                strokeStyle: '#fff',
                fillStyle: insect.trapped ? '#f00' : type === 'BEE' ? '#ff0' : '#000',
            });
        this.renderer.isolatePath(() => {
            this.renderer.fillText(`Score: ${this.player.score}`, 3, 3);
        }, {
                textAlign: 'left',
                textBaseline: 'top',
                fillStyle: '#fff',
                font: '32pt Sans',
            });
    }

    draw() {
        const { x, y, dir, ribbit, tongue } = this.player;
        // draw last ribbit
        if (ribbit.x && ribbit.y) {
            this.renderer.isolatePath(() => {
                this.renderer.arc(ribbit.x, ribbit.y, 2 * (RIBBIT_REST - ribbit.cooldown), 0, Math.PI * 2);
                this.renderer.fill();
            }, {
                    fillStyle: '#0f0',
                    // globalAlpha: 1 / Math.pow(RIBBIT_REST - ribbit.cooldown, 2),
                    globalAlpha: ribbit.cooldown / RIBBIT_REST,
                })
        }

        // draw player
        this.renderer.isolatePath(() => {
            this.renderer.translate(x, y);
            this.renderer.isolatePath(() => {
                this.renderer.fillText('RIBBIT!', 0, -50);
            }, {
                    font: '20pt Arial',
                    fillStyle: '#f00',
                    globalAlpha: this.player.ribbit.cooldown / RIBBIT_REST,
                    textAlign: 'center',
                    textBaseline: 'bottom',
                });
            this.renderer.scale(dir, 1);
            this.renderer.drawSprite('frog', -FROG_SIZE / 2, -FROG_SIZE / 2, FROG_SIZE, FROG_SIZE);
            // draw tongue
            if (tongue.active) {
                this.renderer.isolatePath(() => {
                    this.renderer.translate(33, -23);
                    const tongueX = tongue.length * Math.cos(-Math.PI / 4);
                    const tongueY = tongue.length * Math.sin(-Math.PI / 4);
                    this.renderer.moveTo(0, 0);
                    this.renderer.lineTo(tongueX, tongueY);
                    this.renderer.stroke();
                    this.renderer.path(() => {
                        this.renderer.arc(tongueX, tongueY, TONGUE_TIP_SIZE, 0, Math.PI * 2);
                        this.renderer.fill();
                    }, {
                            fillStyle: '#ff0055',
                        });
                }, {
                        lineCap: 'round',
                        lineWidth: 4,
                        strokeStyle: '#ff0055',
                    });
            }
        }, {
                globalAlpha: 1 - (this.player.injury || 0) / (2 * MAX_INJURY),
            });

        // draw flies
        this.flies.forEach(fly => {
            this.drawInsect(fly, 'FLY');
        });
        // draw flies
        this.bees.forEach(bee => {
            this.drawInsect(bee, 'BEE');
        });
    }
}

module.exports = Game;