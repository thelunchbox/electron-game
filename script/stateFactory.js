const Title = require('./states/title');
const Game = require('./states/game');

const STATES = {
    TITLE: 1,
    GAME: 2,
};

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
    STATES,
};