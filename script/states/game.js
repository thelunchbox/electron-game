const State = require('../state');
const { STATES } = require('../stateFactory');
const Insect = require('../gameObjects/insect');

const { GAME_CONSTANTS, PLAYER_CONSTANTS, INSECT_CONSTANTS } = require('../constants');

const { GAME_HEIGHT, GAME_WIDTH } = GAME_CONSTANTS;
const { RIBBIT_REST, SPEED, TONGUE_TIP_SIZE } = PLAYER_CONSTANTS;
const { INSECT_SIZE, INSECT_SPEED } = INSECT_CONSTANTS;

// const RIBBIT_REST = 60 * 5; // 60 fps * number of seconds
// const RIBBIT_FADE = 300;
const MAX_FLIES = 10;
const MAX_BEES = 2;
const MAX_INJURY = 120;
// const GAME_WIDTH = 1600;
// const GAME_HEIGHT = 900;
// const INSECT_SPEED = 5;
// const INSECT_SIZE = 12;
// const TONGUE_TIP_SIZE = 6;
const FROG_SIZE = 80;

class Game extends State {

    constructor(args) {
        super(args);

        this.flies = [];
        this.bees = [];

        this.player = {
            score: 0,
            x: 800,
            y: 800,
            dir: 1,
            tongue: {
                length: 0,
                active: null,
                frame: 0,
            },
            ribbit: {
                cooldown: 0,
                x: null,
                y: null,
            }
        };
    }

    addInsects(list, max) {
        if (list.length < max) {
            list.push(new Insect);
        };
    }

    update(dt, keys) {
        this.addInsects(this.flies, MAX_FLIES);
        this.addInsects(this.bees, MAX_BEES);

        if (this.player.ribbit.cooldown > 0) {
            this.player.ribbit.cooldown -= 1;
            if (this.player.ribbit.cooldown == 0) {
                this.player.ribbit.x = null;
                this.player.ribbit.y = null;
            }
        }

        if (this.player.injury) {
            // console.log(1 - (this.player.injury || 0) / (2 * MAX_INJURY));
            this.player.injury--;
        }

        if (this.player.tongue.active) {
            const tFrame = this.frame - this.player.tongue.frame;
            const tDiff = ((tFrame - 15) ** 2) / 5;
            if (this.player.tongue.active == 'extend') {
                this.player.tongue.length = this.player.tongue.length + tDiff;
                if (tFrame == 15) {
                    this.player.tongue.active = 'retract';
                }
            } else if (this.player.tongue.active == 'retract') {
                this.player.tongue.length = Math.max(0, this.player.tongue.length - tDiff);
                if (this.player.tongue.length == 0) {
                    this.player.tongue.active = null;
                    this.flies.filter(fly => fly.trapped).forEach(fly => {
                        const index = this.flies.indexOf(fly);
                        this.flies.splice(index, 1);
                        this.player.score += 0.5;
                    });
                    this.bees.filter(bee => bee.trapped).forEach(bee => {
                        const index = this.bees.indexOf(bee);
                        this.bees.splice(index, 1);
                        this.player.score -= 5;
                        this.player.injury = MAX_INJURY;
                    });
                }
            }
        } else {
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

            this.player.x = Math.min(GAME_WIDTH - FROG_SIZE / 2, Math.max(FROG_SIZE / 2, this.player.x));
            this.player.y = Math.min(GAME_HEIGHT - FROG_SIZE / 2, Math.max(FROG_SIZE / 2, this.player.y));

            if (keys.includes(70) && !this.player.injury) {
                this.player.tongue.active = 'extend';
                this.player.tongue.frame = this.frame;
            }

            if (keys.includes(32) && !this.player.ribbit.cooldown) {
                this.player.ribbit = {
                    cooldown: RIBBIT_REST,
                    x: this.player.x,
                    y: this.player.y,
                };
            }
        }
        this.flies.forEach(fly => fly.update(fly, this.player));
        this.bees.forEach(bee => bee.update(bee, this.player));
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