const State = require('../state');
const { STATES } = require('../stateFactory');

const SPEED = 10;
const RIBBIT_REST = 60 * 5; // 60 fps * number of seconds
const RIBBIT_FADE = 300;
const MAX_FLIES = 10;
const GAME_WIDTH = 1600;
const GAME_HEIGHT = 900;
const FLY_SPEED = 5;
const FLY_SIZE = 12;
const TONGUE_TIP_SIZE = 6;

class Game extends State {

    constructor(args) {
        super(args);

        this.flies = [];

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

    // NEXT: Give the frog a tongue that sticks out!

    update(dt, keys) {

        if (this.flies.length < MAX_FLIES) {
            this.flies.push({
                x: Math.random() * GAME_WIDTH,
                y: Math.random() * GAME_HEIGHT,
                target: {
                    x: Math.random() * GAME_WIDTH,
                    y: Math.random() * GAME_HEIGHT,
                },
                trapped: false,
            });
        }

        this.flies.forEach(fly => {
            if (fly.trapped) {
                const { x, y, dir, tongue } = this.player;
                fly.x = x + dir * (tongue.length * Math.cos(-Math.PI / 4)) + dir * 33;
                fly.y = y + (tongue.length * Math.sin(-Math.PI / 4)) - 23;
            } else if (fly.target) {
                const diffX = Math.abs(fly.x - fly.target.x);
                const diffY = Math.abs(fly.y - fly.target.y);
                if (diffX <= FLY_SPEED && diffY <= FLY_SPEED) {
                    fly.target = {
                        x: Math.random() * GAME_WIDTH,
                        y: Math.random() * GAME_HEIGHT,
                    };
                }

                const angle = Math.atan2(fly.target.y - fly.y, fly.target.x - fly.x);
                fly.x += FLY_SPEED*Math.cos(angle);
                fly.y += FLY_SPEED*Math.sin(angle);
            }
        });

        if (this.player.ribbit.cooldown > 0) {
            this.player.ribbit.cooldown -= 1;
            if (this.player.ribbit.cooldown == 0) {
                this.player.ribbit.x = null;
                this.player.ribbit.y = null;
            }
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
                }
            }

            this.flies.forEach(fly => {
                const { dir, tongue } = this.player;
                const tongueX = this.player.x + dir * (tongue.length * Math.cos(-Math.PI / 4));
                const tongueY = this.player.y + (tongue.length * Math.sin(-Math.PI / 4));
                const diffX = Math.abs(fly.x - tongueX);
                const diffY = Math.abs(fly.y - tongueY);
                // did we eat a fly?
                if (diffX <= TONGUE_TIP_SIZE + FLY_SIZE + 2 * FLY_SPEED && diffY <= TONGUE_TIP_SIZE + FLY_SIZE + 2 * FLY_SPEED) {
                    // yup
                    fly.trapped = true;
                }
            })

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
    super.update();
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
            // draw tongue
            if (tongue.active) {
                renderer.isolatePath(() => {
                    renderer.translate(33, -23);
                    const tongueX = tongue.length * Math.cos(-Math.PI / 4);
                    const tongueY = tongue.length * Math.sin(-Math.PI / 4);
                    renderer.moveTo(0, 0);
                    renderer.lineTo(tongueX, tongueY);
                    renderer.stroke();
                    renderer.path(() => {
                        renderer.arc(tongueX, tongueY, TONGUE_TIP_SIZE, 0, Math.PI * 2);
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

        // draw flies
        this.flies.forEach(fly => {
            renderer.isolatePath(() => {
                renderer.strokeAndFillCircle(fly.x, fly.y, FLY_SIZE);
                renderer.path(() => {
                    renderer.oscillateText('buzz', fly.x + FLY_SIZE, fly.y, this.frame * 2, { amplitude: 10, outline: false });
                }, {
                    fillStyle: '#fff',
                    textAlign: 'left',
                });
                renderer.path(() => {
                    renderer.oscillateText('buzz', fly.x - FLY_SIZE, fly.y, this.frame * 2, { amplitude: 10, reverse: true, outline: false });
                }, {
                    fillStyle: '#fff',
                    textAlign: 'right',
                });
            }, {
                lineWidth: 4,
                strokeStyle: '#fff',
                fillStyle: fly.trapped ? '#f00' : '#000',
            });
            renderer.isolatePath(() => {
               renderer.fillText(`Score: ${this.player.score}`, 3, 3); 
            }, {
                textAlign: 'left',
                textBaseline: 'top',
                fillStyle: '#fff',
                font: '32pt Sans',
            });
        });
    }
}

module.exports = Game;