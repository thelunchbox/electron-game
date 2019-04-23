const { remote } = require('electron');
const { getStartingState, getNextState } = require('./stateFactory');
const Renderer = require('./renderer');
const electronWindow = remote.getCurrentWindow();

const keys = [];
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
        default: // all others
            keys.push(keyCode);
            break;
    }
});

window.addEventListener('keyup', ({ keyCode }) => {
    const index = keys.indexOf(keyCode);
    if (index < 0) return;
    keys.splice(index, 1);
});

const renderer = new Renderer(document.body);
let state = getStartingState();

let last = (new Date()).getTime();
const update = () => {
    const time = (new Date()).getTime();
    const dt = time - last;

    // Update the current game state - it should return the new state type and args if we need to change
    const next = state.update(dt, keys);
    if (next) {
        state = getNextState(next);
    }

    last = time;
    setTimeout(update, 16);
};

const draw = () => {
    renderer.reset();
    state.draw(renderer);
    window.requestAnimationFrame(draw);
};

update();
requestAnimationFrame(draw);
