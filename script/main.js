const { remote } = require('electron');
const { getStartingState, getNextState } = require('./stateFactory');
const { createRenderer } = require('./renderer');
const electronWindow = remote.getCurrentWindow();
const path = require('path');

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
      const index = keys.indexOf(keyCode);
      if (index > -1) return;
      keys.push(keyCode);
      break;
  }
});

window.addEventListener('keyup', ({ keyCode }) => {
  const index = keys.indexOf(keyCode);
  if (index < 0) return;
  keys.splice(index, 1);
});

const renderer = createRenderer(document.body);
let state = getStartingState();

// load any images - we could loop through the img folder if we needed to
renderer.loadSprite('frog', './img/frog.png');

let last = (new Date()).getTime();
const update = () => {
  const time = (new Date()).getTime();
  const dt = time - last;

  try {
    // Update the current game state - it should return the new state type and args if we need to change
    const next = state.update(dt, keys);
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
    state.draw();
  } catch (ex) {
    console.error('Error while drawing', ex);
  }
  window.requestAnimationFrame(draw);
};

update();
requestAnimationFrame(draw);
