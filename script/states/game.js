const State = require('../state');
const { STATES } = require('../stateFactory');

const SPEED = 10;
const RIBBIT_REST = 60 * 5; // 60 fps * number of seconds
const RIBBIT_FADE = 300;
const MAX_TONGUE = 200;

class Game extends State {

    constructor(args) {
        super(args);

        this.player = {
            x: 800,
            y: 800,
            dir: 1,
            tongue: {
                length: 0,
                active: null,
            },
            ribbit: {
                cooldown: 0,
                x: null,
                y: null,
            }
        };
    }

    // NEXT: Give the frog a tongue that sticks out!

    update(dt, keys) {
        if (this.player.ribbit.cooldown > 0) {
            this.player.ribbit.cooldown -= 1;
            if (this.player.ribbit.cooldown == 0) {
                this.player.ribbit.x = null;
                this.player.ribbit.y = null;
            }
        }

        if (this.player.tongue.active) {
            if (this.player.tongue.active == 'extend') {
                this.player.tongue.length = Math.min(MAX_TONGUE, this.player.tongue.length + 20);
                if (this.player.tongue.length == MAX_TONGUE) {
                    this.player.tongue.active = 'retract';
                }
            } else if (this.player.tongue.active == 'retract') {
                this.player.tongue.length = Math.max(0, this.player.tongue.length - 20);
                if (this.player.tongue.length == 0) {
                    this.player.tongue.active = null;
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

            if (keys.includes(70)) {
                this.player.tongue.active = 'extend';
            }

            if (keys.includes(32) && !this.player.ribbit.cooldown) {
                this.player.ribbit = {
                    cooldown: RIBBIT_REST,
                    x: this.player.x,
                    y: this.player.y,
                };
            }
        }
    }

    draw(renderer) {
        const { x, y, dir, ribbit, tongue } = this.player;
        // draw last ribbit
        if (ribbit.x && ribbit.y) {
            renderer.isolatePath(() => {
                renderer.arc(ribbit.x, ribbit.y, 2 * (RIBBIT_REST - ribbit.cooldown), 0, Math.PI * 2);
                renderer.fill();
            }, {
                    fillStyle: '#0f0',
                    // globalAlpha: 1 / Math.pow(RIBBIT_REST - ribbit.cooldown, 2),
                    globalAlpha: ribbit.cooldown / RIBBIT_REST,
                })
        }

        // draw player
        renderer.isolatePath(() => {
            renderer.translate(x, y);
            renderer.isolatePath(() => {
                renderer.fillText('RIBBIT!', 0, -50);
            }, {
                    font: '20pt Arial',
                    fillStyle: '#f00',
                    globalAlpha: this.player.ribbit.cooldown / RIBBIT_REST,
                    textAlign: 'center',
                    textBaseline: 'bottom',
                });
            renderer.scale(dir, 1);
            renderer.drawSprite('frog', -40, -40, 80, 80);
            if (tongue.active) {
                renderer.isolatePath(() => {
                    renderer.translate(33, -23);
                    const tongueX = tongue.length * Math.cos(-Math.PI / 4);
                    const tongueY = tongue.length * Math.sin(-Math.PI / 4);
                    renderer.moveTo(0, 0);
                    renderer.lineTo(tongueX, tongueY);
                    renderer.stroke();
                    renderer.path(() => {
                        renderer.arc(tongueX, tongueY, 6, 0, Math.PI * 2);
                        renderer.fill();
                    }, {
                            fillStyle: '#ff0055',
                        });
                }, {
                        lineCap: 'round',
                        lineWidth: 4,
                        strokeStyle: '#ff0055',
                    });
            }
        });
    }
}

module.exports = Game;