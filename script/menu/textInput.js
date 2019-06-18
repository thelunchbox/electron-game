const inputConfigs = require('../config/input');
const { PLAYER_COLORS } = require('../constants');
const COOLDOWN = 120;
const CHARACTER_MAP = '_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*-';

class TextInput {
    constructor({ x, y, id, defaultValue = '', renderer } = {}) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.input = inputConfigs[id];
        this.renderer = renderer;
        this.cooldown = 0;

        this.characterArray = [0,0,0,0,0,0,0,0,0,0];
        this.currentCharacter = 0;
        this.ready = false;
    }

    setOnChange(callback) {
        this.onChange = callback;
    }

    update (dt, keys) {
        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - dt);
            return;
        }

        if (keys.includes(this.input.down)) {
            const value = (this.characterArray[this.currentCharacter] + 1) % CHARACTER_MAP.length;
            this.characterArray[this.currentCharacter] = value;
            this.cooldown = COOLDOWN;
        }
        if (keys.includes(this.input.up)) {
            let value = (this.characterArray[this.currentCharacter] - 1);
            if (value < 0) value = CHARACTER_MAP.length - 1;
            this.characterArray[this.currentCharacter] = value;
            this.cooldown = COOLDOWN;
        }
        if (keys.includes(this.input.left)) {
            let value = (this.currentCharacter - 1);
            if (value < 0) value = this.characterArray.length - 1;
            this.currentCharacter = value;
            this.cooldown = COOLDOWN;
        }
        if (keys.includes(this.input.right)) {
            const value = (this.currentCharacter + 1) % this.characterArray.length;
            this.currentCharacter = value;
            this.cooldown = COOLDOWN;
        }
        if (keys.includes(this.input.ribbit) || keys.includes(this.input.tongue)) {
            this.onChange && this.onChange(this._getValue());
            this.ready = true;
            this.cooldown = COOLDOWN;
        }

    }

    _getValue() {
        return this.characterArray.reduce((value, character) => {
            return value + CHARACTER_MAP[character];
        }, '');
    }

    draw () {
        const displayValue = this.ready ? 'READY!' : this._getValue();
        this.renderer.isolatePath(() => {
            this.renderer.highlightText(displayValue, this.x, this.y, { range: this.ready ? [] : [this.currentCharacter] });
        }, {
            font: '32pt Arial',
            fillStyle: PLAYER_COLORS[this.id],
            textAlign: 'left',
            textBaseline: 'top'
        });
    }
}

module.exports = TextInput;