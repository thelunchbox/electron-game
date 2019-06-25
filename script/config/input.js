const inputKeysDev = [{
    tongue: 70,
    ribbit: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
}, {}, {}, {}];

const inputKeys = [{
    tongue: 55,
    ribbit: 57,
    up: 192,
    down: 49,
    left: 50,
    right: 51,
},{
    tongue: 85,
    ribbit: 79,
    up: 81,
    down: 61,
    left: 69,
    right: 87,
},{
    tongue: 71,
    ribbit: 75,
    up: 221,
    down: 220,
    left: 65,
    right: 83,
},{
    tongue: 190,
    ribbit: 191,
    up: 88,
    down: 67,
    left: 90,
    right: 222,
}];

const { DEV_MODE } = require('../constants');

module.exports = DEV_MODE ? inputKeysDev : inputKeys;