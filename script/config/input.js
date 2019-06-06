const inputKeysDev = [{
    tongue: 70,
    ribbit: 32,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
}, {}, {}, {}];

const inputKeys = [{
    tongue: 54,
    ribbit: 55,
    up: 192,
    down: 49,
    left: 50,
    right: 51,
},{
    tongue: 89,
    ribbit: 85,
    up: 61,
    down: 81,
    left: 87,
    right: 69,
},{
    tongue: 71,
    ribbit: 72,
    up: 221,
    down: 220,
    left: 65,
    right: 83,
},{
    tongue: 78,
    ribbit: 77,
    up: 222,
    down: 90,
    left: 88,
    right: 67,
}];

const isDev = true;

module.exports = isDev ? inputKeysDev : inputKeys;