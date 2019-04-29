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
            renderer.strokeAndFillText('Frog Battle', renderer.center.x, renderer.center.y);
            renderer.isolatePath(() => {
                renderer.oscillateText('Press Any Key', renderer.center.x, renderer.center.y + 100, this.frame, { drag: 3 });
            }, {
                font: '36pt Arial',
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