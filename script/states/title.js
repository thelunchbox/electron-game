const State = require('../state');
const STATES = require('../states');

class Title extends State {

    update(dt, keys) {
        if (keys.length > 0) {
            this.next = STATES.NAME_ENTRY;
        }
        return super.update(dt, keys);
    }

    draw() {
        this.renderer.isolatePath(() => {
            this.renderer.strokeAndFillText('Frog Battle', this.renderer.center.x, this.renderer.center.y);
            this.renderer.isolatePath(() => {
                this.renderer.oscillateText('Press Any Key', this.renderer.center.x, this.renderer.center.y + 100, this.frame, { drag: 3, padding: 2 });
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