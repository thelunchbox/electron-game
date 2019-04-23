const State = require('../state');
const STATES = require('../states');

class Title extends State {

    update(dt, keys) {
        if (keys.length > 0) {
            this.next = STATES.GAME;
        }
        return super.update(dt, keys);
    }

    draw(renderer) {
        renderer.isolatePath(() => {
            renderer.strokeAndFillText('Game Title', renderer.center.x, renderer.center.y);
            renderer.isolatePath(() => {
                renderer.fillText('Press Any Key', renderer.center.x, renderer.center.y + 100);
            }, {
                font: '36pt Arial',
                globalAlpha: Math.sin(this.frame / 20) / 2 + 0.5,
            })
        }, {
            font: '72pt Arial',
            fillStyle: '#fff',
            strokeStyle: '#000',
            lineWidth: 10,
            lineJoin: 'round',
            textAlign: 'center',
            textBaseline: 'middle',
        });
    }
}

module.exports = Title;