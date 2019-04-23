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
            renderer.strokeAndFillText('Frog Game', renderer.center.x, renderer.center.y);
            renderer.isolatePath(() => {
                renderer.strokeAndFillText('Press Any Key', renderer.center.x, renderer.center.y + 100);
            }, {
                font: '36pt Arial',
                globalAlpha: Math.sin(this.frame / 20) / 2 + 0.5,
                strokeStyle: '#f00',
            })
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