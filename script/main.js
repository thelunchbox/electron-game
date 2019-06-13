const { remote } = require('electron');
const { getStartingState, getNextState } = require('./stateFactory');
const Renderer = require('./renderer');
const electronWindow = remote.getCurrentWindow();

const {
    gamepads,
    addKeyboardController,
    GamepadButton,
    GamepadButtonTypes,
    GamepadTypes,
    KeyboardKeyCodes,
    processGamepadActivity,
    setDefaultConfiguration,
} = require('gamepad-flex');

addKeyboardController(true);

const INPUTS = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    START: 'START',
};

setDefaultConfiguration(GamepadTypes.KEYBOARD, [
    new GamepadButton(INPUTS.UP, KeyboardKeyCodes.w, GamepadButtonTypes.KEY, -1),
    new GamepadButton(INPUTS.DOWN, KeyboardKeyCodes.s, GamepadButtonTypes.KEY, 1),
    new GamepadButton(INPUTS.LEFT, KeyboardKeyCodes.a, GamepadButtonTypes.KEY, -1),
    new GamepadButton(INPUTS.RIGHT, KeyboardKeyCodes.d, GamepadButtonTypes.KEY, 1),
    new GamepadButton(INPUTS.A, KeyboardKeyCodes.j, GamepadButtonTypes.KEY, 1),
    new GamepadButton(INPUTS.B, KeyboardKeyCodes.k, GamepadButtonTypes.KEY, 1),
    new GamepadButton(INPUTS.C, KeyboardKeyCodes.l, GamepadButtonTypes.KEY, 1),
    new GamepadButton(INPUTS.D, KeyboardKeyCodes.i, GamepadButtonTypes.KEY, 1),
    new GamepadButton(INPUTS.START, KeyboardKeyCodes.enter, GamepadButtonTypes.KEY, 1),
]);

window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 27:
            electronWindow.close();
            break;
        case 121: // F10
        case 122: // F11
            electronWindow.setKiosk(!electronWindow.isKiosk());
            break;
        case 116: // F5
            electronWindow.reload();
            break;
        case 123: // F12
            remote.getCurrentWebContents().openDevTools();
            break;
    }
});

const renderer = new Renderer(document.body);
let state = getStartingState();

// load any images - we could loop through the img folder if we needed to
renderer.loadSprite('frog', './img/frog.png');

let last = (new Date()).getTime();
const update = () => {
    const time = (new Date()).getTime();
    const dt = time - last;

    try {
        // Update the current game state - it should return the new state type and args if we need to change
        processGamepadActivity();
        const next = state.update(dt);
        if (next) {
            state = getNextState(next);
        }
    } catch (ex) {
        console.error('Error while updating', ex);
    }
    last = time;
    setTimeout(update, 16);
};

const draw = () => {
    renderer.reset();
    try {
        state.draw(renderer);
    } catch (ex) {
        console.error('Error while drawing', ex);
    }
    window.requestAnimationFrame(draw);
};

update();
requestAnimationFrame(draw);
