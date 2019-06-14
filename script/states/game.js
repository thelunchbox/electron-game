const State = require('../state');
const STATES = require('../states');
const Bee = require('../gameObjects/bee');
const Insect = require('../gameObjects/insect');
const Player = require('../gameObjects/player');
const { GAME_CONSTANTS, RAINBOW } = require('../constants')

const MAX_FLIES = 10;
const MAX_BEES = 2;
const TIME_LIMIT = 60 * 1000;
const WINNER_COOLDOWN = 5 * 1000;

class Game extends State {

    constructor(args) {
        super(args);

        this.flies = [];
        this.bees = [];
        this.time = 0;

        this.players = [
            new Player(400, 400, 0),
            new Player(400, 800, 1),
            new Player(1200, 400, 2),
            new Player(1200, 800, 3),
        ];
    }

    update(dt, keys) {

        this.time += dt;
        if (this.time > TIME_LIMIT) {
            if (this.time > TIME_LIMIT + WINNER_COOLDOWN) {
                this.next = STATES.TITLE;
            }
        } else {
            if (this.flies.length < MAX_FLIES) { this.flies.push(new Insect); }
            if (this.bees.length < MAX_BEES) { this.bees.push(new Bee); }
            this.players.forEach(p => p.update(keys, this.frame, this.flies, this.bees));
        }

        this.flies.forEach(fly => fly.update(this.players));
        this.bees.forEach(bee => bee.update(this.players));
        
        return super.update();
    }

    draw() {
        // draw player
        this.players.forEach(p => p.draw(this.renderer, this.frame));
        
        // draw flies
        this.flies.forEach(fly => {
            fly.draw(this.renderer, this.frame);
        });
        
        // draw bees
        this.bees.forEach(bee => {
            bee.draw(this.renderer, this.frame);
        });

        if (this.time > TIME_LIMIT) {
            const winner = this.players.reduce((best, frog) => frog.score > best.score ? frog : best, { score: -9999 });
            this.renderer.isolatePath(() => {
                this.renderer.oscillateText(`WINNER: ${winner.name || 'P' + (winner.id + 1)}`, this.renderer.center.x, this.renderer.center.y, this.frame * 2, { amplitude: 10, outline: true });
            }, {
                font: '72pt Arial',
                fillStyle: RAINBOW[Math.floor(this.frame / 60) % RAINBOW.length],
                strokeStyle: '#000',
                lineWidth: 10,
                textAlign: 'center',
                textBaseline: 'middle'
            });
        } else {
            const time = (TIME_LIMIT - this.time) / 1000;
            this.renderer.isolatePath(() => {
                this.renderer.strokeAndFillText(Math.floor(time), this.renderer.center.x, GAME_CONSTANTS.GAME_HEIGHT - 5);
            }, {
                font: '72pt Arial',
                fillStyle: RAINBOW[Math.floor(this.frame / 60) % RAINBOW.length],
                strokeStyle: '#000',
                lineWidth: 10,
                textAlign: 'center',
                textBaseline: 'bottom'
            });
        }
    }
}

module.exports = Game;