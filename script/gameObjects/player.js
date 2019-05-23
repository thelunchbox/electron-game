const { GAME_CONSTANTS, INSECT_CONSTANTS, PLAYER_CONSTANTS } = require('../constants');

const { GAME_HEIGHT, GAME_WIDTH } = GAME_CONSTANTS;
const { INSECT_SIZE, INSECT_SPEED } = INSECT_CONSTANTS;
const { FROG_SIZE, MAX_INJURY, RIBBIT_REST, SPEED, TOUNGUE_TIP_SIZE } = PLAYER_CONSTANTS;

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

    update(keys, frame, flies, bees) {
        this._recoverInjury();
        this._handleTongue(keys, frame, flies, bees);
        this._handleRibbit(keys);
        this._movePlayer(keys);
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
            if (keys.includes(70) && !this.injury) {
                this.tongue.active = 'extend';
                this.tongue.frame = frame;
            }
        }
    }

    _recoverInjury() {
        if (this.injury) {
            this.injury -= 1;
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
            if (keys.includes(32) && !this.ribbit.cooldown) {
                this.ribbit = {
                    cooldown: RIBBIT_REST,
                    x: this.x,
                    y: this.y,
                };
            }
        }
    }

    _movePlayer(keys) {
        if (!this.tongue.active) {
            if (keys.includes(38)) {
                this.y -= SPEED;
            } else if (keys.includes(40)) {
                this.y += SPEED;
            }
    
            if (keys.includes(37)) {
                this.x -= SPEED;
                this.dir = -1;
            } else if (keys.includes(39)) {
                this.x += SPEED;
                this.dir = 1;
            }

            this.x = Math.min(GAME_WIDTH - FROG_SIZE / 2, Math.max(FROG_SIZE / 2, this.x));
            this.y = Math.min(GAME_HEIGHT - FROG_SIZE / 2, Math.max(FROG_SIZE / 2, this.y));
        }
    }
}

module.exports = Player;
