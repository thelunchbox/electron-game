const State = require('../state');
const STATES = require('../states');
const TextInput = require('../menu/textInput');

class NameEntry extends State {
    constructor(args) {
        super(args);

        this.nextArgs = {};

        this.playerInputs = [];
        this.nextArgs.names = [];
        for(let i = 0; i < 4; i++) {
            const player = new TextInput({
                x: 70 + (400 * i),
                y: 400,
                id: i,
                renderer: this.renderer,
            });
            player.setOnChange(value => {
                this.nextArgs.names[i] = value;
            });
            this.playerInputs[i] = player;
        }
    }

    update(dt, keys) {
        this.playerInputs.forEach(p => p.update(dt, keys));

        if (this.nextArgs.names.length > 0 && this.nextArgs.names.every(v => !!v)) {
            this.next = STATES.GAME;
        }
        return super.update(dt, keys);
    }

    draw() {
        this.playerInputs.forEach(p => p.draw());
    }
}

module.exports = NameEntry;