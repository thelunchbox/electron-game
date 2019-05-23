const Insect = require('./insect');
const { INSECT_CONSTANTS } = require('../constants');

const { INSECT_SIZE } = INSECT_CONSTANTS;

class Bee extends Insect {
    constructor() {
        super();
    }

    draw(renderer, frame) {
        renderer.isolatePath(() => {
            renderer.translate(this.x, this.y);
            renderer.strokeAndFillCircle(0, 0, INSECT_SIZE);
            renderer.path(() => {
                renderer.oscillateText('buzz', INSECT_SIZE, 0, frame * 2, { amplitude: 10, outline: false });
            }, {
                fillStyle: '#fff',
                textAlign: 'left',
            });
            renderer.path(() => {
                renderer.oscillateText('buzz', -INSECT_SIZE, 0, frame * 2, { amplitude: 10, reverse: true, outline: false });
            }, {
                fillStyle: '#fff',
                textAlign: 'right',
            });
            renderer.isolatePath(() => {
                renderer.rotate(Math.PI / 2);
                renderer.fillText('ouch', INSECT_SIZE, 0);
            }, {
                font: '8pt Sans',
                fillStyle: '#F5AF22',
                textAlign: 'left',
                textBaseline: 'middle',
            });
        }, {
            lineWidth: 4,
            strokeStyle: '#fff',
            fillStyle: this.trapped ? '#f00' : '#ff0',
        });
    };
}

module.exports = Bee;
