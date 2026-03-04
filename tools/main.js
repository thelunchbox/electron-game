const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let toolWindow;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: 'build/icon.png',
    title: 'SPRITE TOOL',
    kiosk: false, // true for full screen, false for windowed
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'sprite.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // -------------------------------------------------------
  // uncomment this line if you need to debug startup issues
  // -------------------------------------------------------
  // mainWindow.webContents.openDevTools();
  // -------------------------------------------------------

  if (process.argv.includes('--devtools') || process.argv.includes('-d'))
    mainWindow.webContents.openDevTools();

  if (process.argv.includes('--windowed') || process.argv.includes('-w'))
    mainWindow.setKiosk(false);

  ipcMain.handle('show-select-folder', async (event, options) => {
    const { canceled, directory } = await dialog.showOpenDialog(toolWindow, {
      title: 'Select image folder',
      properties: [
        'openDirectory'
      ],
    });
    return !canceled ? directory : null;
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});