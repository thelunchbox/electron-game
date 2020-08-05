const State = require('../state');
const STATES = require('../states');
const { getRenderer } = require('../renderer');
const Sprite = require('../utils/sprite');

const testAnimations = {
  stand: {
    frames: [
      [0, 0, 5],
      [0, 1, 5],
      [0, 2, 5],
      [0, 1, 5],
    ],
    next: 'jump',
  },
  jump: {
    frames: [
      [1, 0, 5],
      [1, 1, 5],
      [1, 2, 5],
      [1, 1, 5],
    ],
    next: 'slip',
  },
  slip: {
    frames: [
      [2, 0, 5],
      [2, 1, 5],
      [2, 2, 5],
      [2, 3, 5],
      [2, 4, 25],
    ],
    next: 'letters',
  },
  letters: {
    frames: [
      [3, 0, 2],
      [3, 1, 2],
      [3, 2, 2],
      [3, 3, 2],
      [3, 4, 2],
    ],
    next: 'numbers',
  },
  numbers: {
    frames: [
      [4, 0, 2],
      [4, 1, 2],
      [4, 2, 2],
      [4, 3, 2],
      [4, 4, 2],
    ],
    next: 'stand',
  },
};

class Title extends State {

  constructor() {
    super();
    this.test = new Sprite('test', './img/test.png', 20, 20, testAnimations);
  }

  update(dt, keys) {
    if (keys.length > 0) {
      this.next = STATES.GAME;
    }
    this.test.update();
    return super.update(dt, keys);
  }

  draw() {
    const r = getRenderer();
    this.test.draw(10, 10, {
      width: 100,
      height: 100,
    });
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