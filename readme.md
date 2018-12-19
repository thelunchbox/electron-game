# electron-game

## A base for making node.js games with canvas and electron

### update

The update loop is inside `script/main.js` - simply add the update code for your game there.
The current time, as well as the time difference since the last update, are both calculated automatically.

### draw

The draw loop is also inside `script/main.js` - simply add the draw code for your game in the `draw` function.
The canvas is automatically cleared each loop using the canvas `clearRect` function.
