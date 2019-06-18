const STATES = require('./states');
const Title = require('./states/title');
const Game = require('./states/game');
const NameEntry = require('./states/nameEntry');

const getStartingState = (renderer) => new Title({ renderer });

const getNextState = ({ next, args }) => {
    switch (next) {
        case STATES.TITLE:
            return new Title(args);
        case STATES.GAME:
            return new Game(args);
        case STATES.NAME_ENTRY:
            return new NameEntry(args);
    }
};

module.exports = {
    getNextState,
    getStartingState,
};