const State = require('../state');
const { STATES } = require('../stateFactory');

class Title extends State {

    update(dt, keys) {
        if (keys.length > 0) {
            this.next = 2; // STATES.GAME; // why isn't this working?
        }
        return super.update(dt, keys);
    }

    draw(renderer) {
        renderer.isolatePath(() => {
            renderer.strokeAndFillText('GAME TITLE', renderer.center.x, renderer.center.y);
        }, {
            font: '72pt Arial',
            fillStyle: '#fff',
            strokeStyle: '#0aa',
            lineWidth: 10,
            lineJoin: 'round',
            textAlign: 'center',
            textBaseline: 'middle',
        });
    }
}

module.exports = Title;