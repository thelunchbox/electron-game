const STATES = require('./states');
const Title = require('./states/title');
const Game = require('./states/game');

const getStartingState = () => new Title({});

const getNextState = ({ next, args }) => {
  switch (next) {
    case STATES.TITLE:
      return new Title(args);
    case STATES.GAME:
      return new Game(args);
  }
};

module.exports = {
  getNextState,
  getStartingState,
};