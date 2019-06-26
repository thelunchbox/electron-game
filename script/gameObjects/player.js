const { GAME_CONSTANTS, PLAYER_CONSTANTS, PLAYER_COLORS } = require('../constants');
const inputConfigs = require('../config/input');
const { GAME_HEIGHT, GAME_WIDTH } = GAME_CONSTANTS;
const { FROG_SIZE, MAX_INJURY, RIBBIT_REST, SPEED, TONGUE_TIP_SIZE } = PLAYER_CONSTANTS;

class Player {
    constructor(x, y, id, name) {
        this.score = 0,
            this.id = id,
            this.name = name,
            this.input = inputConfigs[id],
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
                id,
            };

        console.log(`Player ${this.id + 1} controls:`);
        console.log(this.input);
    }

    update(keys, frame, flies, bees, ribbits) {
        this._recoverInjury();
        this._handleTongue(keys, frame, flies, bees);
        this._handleOtherRibbits(ribbits);
        this._handleRibbit(keys);
        this._movePlayer(keys);
    }

    draw(renderer, frame) {
        // draw last ribbit
        if (this.ribbit.x && this.ribbit.y) {
            renderer.isolatePath(() => {
                renderer.arc(this.ribbit.x, this.ribbit.y, 2 * (RIBBIT_REST - this.ribbit.cooldown), 0, Math.PI * 2);
                renderer.fill();
            }, {
                    fillStyle: PLAYER_COLORS[this.id],
                    globalAlpha: this.ribbit.cooldown / RIBBIT_REST,
                })
        }

        // draw player
        renderer.isolatePath(() => {
            renderer.translate(this.x, this.y);
            renderer.isolatePath(() => {
                renderer.fillText('RIBBIT!', 0, -50);
            }, {
                    font: '20pt Arial',
                    fillStyle: '#f00',
                    globalAlpha: this.ribbit.cooldown / RIBBIT_REST,
                    textAlign: 'center',
                    textBaseline: 'bottom'
                });
            renderer.scale(this.dir, 1);
            const color = PLAYER_COLORS[this.id];

            renderer.drawSprite(`frog${color}`, -FROG_SIZE / 2, -FROG_SIZE / 2, FROG_SIZE, FROG_SIZE);
            // draw tongue
            if (this.tongue.active) {
                renderer.isolatePath(() => {
                    renderer.translate(33, -23);
                    const tongueX = this.tongue.length * Math.cos(-Math.PI / 4);
                    const tongueY = this.tongue.length * Math.sin(-Math.PI / 4);
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
        }, {
                globalAlpha: 1 - (this.injury || 0) / (2 * MAX_INJURY),
            });

        // draw score
        renderer.isolatePath(() => {
            renderer.fillText(`${this.name || 'SCORE'}: ${this.score}`, 3 + this.id * 400, 3);
        }, {
                textAlign: 'left',
                textBaseline: 'top',
                fillStyle: PLAYER_COLORS[this.id],
                font: '32pt Sans',
            });
    }

    _handleTongue(keys, frame, flies, bees) {
        if (this.tongue.active) {
            const tFrame = frame - this.tongue.frame;
            const tDiff = ((tFrame - 15) ** 2) / 5;
            if (this.tongue.active === 'extend') {
                this.tongue.length = this.tongue.length + tDiff;
                if (tFrame == 15) {
                    this.tongue.active = 'retract';
                }
            }

            if (this.tongue.active === 'retract') {
                this.tongue.length = Math.max(0, this.tongue.length - tDiff);
                if (this.tongue.length == 0) {
                    this.tongue.active = null;
                    flies.filter(fly => fly.trapped).forEach(fly => {
                        const index = flies.indexOf(fly);
                        flies.splice(index, 1);
                        this.score += 0.5;
                    });
                    bees.filter(bee => bee.trapped).forEach(bee => {
                        const index = bees.indexOf(bee);
                        bees.splice(index, 1);
                        this.score -= 5;
                        this.injury = MAX_INJURY;
                    });
                }
            }
        } else {
            if (keys.includes(this.input.tongue) && !this.injury) {
                this.tongue.active = 'extend';
                this.tongue.frame = frame;
            }
        }
    }

    _recoverInjury() {
        if (this.injury) {
            this.injury = Math.max(0, this.injury - 1);
        }
    }

    _handleRibbit(keys) {
        if (this.ribbit.cooldown > 0) {
            this.ribbit.cooldown -= 1;
            if (this.ribbit.cooldown == 0) {
                this.ribbit.x = null;
                this.ribbit.y = null;
            }
        }

        if (!this.tongue.active) {
            if (keys.includes(this.input.ribbit) && !this.ribbit.cooldown) {
                this.ribbit = {
                    cooldown: RIBBIT_REST,
                    x: this.x,
                    y: this.y,
                    id: this.id,
                };
            }
        }
    }

    _handleOtherRibbits(ribbits) {
        ribbits.forEach(ribbit => {
            const { x, y, cooldown, id } = ribbit;
            if (this.id !== id &&
                !this.injury &&
                ((this.x - x) ** 2 + (this.y - y) ** 2) < ((2 * (RIBBIT_REST - cooldown)) ** 2)) {
                this.injury = cooldown * MAX_INJURY / RIBBIT_REST;
            }
        });
    }

    _movePlayer(keys) {

        let vx = 0, vy = 0;

        if (!this.tongue.active) {
            if (keys.includes(this.input.up)) {
                vy = -SPEED;
            } else if (keys.includes(this.input.down)) {
                vy = SPEED;
            }

            if (keys.includes(this.input.left)) {
                vx = -SPEED;
                this.dir = -1;
            } else if (keys.includes(this.input.right)) {
                vx = SPEED;
                this.dir = 1;
            }

            if (vy && vx) {
                vx *= 0.707; // cos(pi/4)
                vy *= 0.707; // sin(pi/4)
            }

            this.x = Math.min(
                GAME_WIDTH - FROG_SIZE / 2,
                Math.max(
                    FROG_SIZE / 2,
                    this.x + vx,
                ),
            );
            this.y = Math.min(
                GAME_HEIGHT - FROG_SIZE / 2,
                Math.max(
                    FROG_SIZE / 2,
                    this.y + vy,
                ),
            );
        }
    }
}

module.exports = Player;
