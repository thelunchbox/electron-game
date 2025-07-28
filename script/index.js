const { ipcRenderer } = require('electron');
const { getStartingState, getNextState } = require('./stateFactory');
const { createRenderer } = require('./renderer');

const keys = [];

window.addEventListener('keydown', event => {
  let keyCode = event.keyCode;
  if (event.ctrlKey) {
    switch (keyCode) {
    case 73: // ctrl + i for dev tools
      keyCode = 123;
      break;
    case 70: // ctrl + f for full screen
      keyCode = 122;
      break;
    case 82: // ctrl + r to refresh
      keyCode = 116;
      break;
    }
  }
  const index = keys.indexOf(keyCode);
  switch (keyCode) {
  case 27:
    ipcRenderer.send('close');
    break;
  case 121: // F10
  case 122: // F11
    console.log('toggling kiosk mode');
    ipcRenderer.send('toggle-kiosk');
    break;
  case 116: // F5
    state.unload && state.unload();
    ipcRenderer.send('reload');
    break;
  case 123: // F12
    ipcRenderer.send('open-dev-tools');
    break;
  default: // all others
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
