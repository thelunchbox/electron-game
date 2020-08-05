const State = require('../state');
const STATES = require('../states');
const { getRenderer } = require('../renderer');

class Title extends State {

  update(dt, keys) {
    if (keys.length > 0) {
      this.next = STATES.GAME;
    }
    return super.update(dt, keys);
  }

  draw() {
    const r = getRenderer();
    r.isolatePath({
      font: '72pt Arial',
      fillStyle: '#fff',
      strokeStyle: '#000',
      lineWidth: 10,
      lineJoin: 'round',
      textAlign: 'center',
      textBaseline: 'middle',
    }, () => {
      r.strokeAndFillText('Game Title', r.center.x, r.center.y);
      r.isolatePath({ fontSize: 36 }, () => {
        r.oscillateText('Press Any Key', r.center.x, r.center.y + 100, this.frame, { drag: 3, padding: 3 });
      });
    });
  }
}

module.exports = Title;