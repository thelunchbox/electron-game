const Insect = require('./insect');

class Fly extends Insect {
  constructor() {
    super();
  }

  update(insect, player) {
    super(insect, player);
  }
}

module.exports = Fly;
