const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: 'build/icon.png',
    title: '** GAME TITLE GOES HERE **',
    kiosk: false, // true for full screen, false for windowed
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.setMenu(null);

  // -------------------------------------------------------
  // uncomment this line if you need to debug startup issues
  // -------------------------------------------------------
  // mainWindow.webContents.openDevTools();
  // -------------------------------------------------------

  if (process.argv.includes('--devtools') || process.argv.includes('-d'))
    mainWindow.webContents.openDevTools();

  if (process.argv.includes('--windowed') || process.argv.includes('-w'))
    mainWindow.setKiosk(false);

  ipcMain.on('close', () => {
    mainWindow.close();
  });

  ipcMain.on('toggle-kiosk', (event, value) => {
    const mode = value === undefined ? !mainWindow.kiosk : value;
    mainWindow.setKiosk(mode);
  });

  ipcMain.on('reload', () => {
    mainWindow.webContents.reload();
  });

  ipcMain.on('open-dev-tools', () => {
    mainWindow.webContents.openDevTools();
  });

  ipcMain.handle('get-kiosk-mode', () => mainWindow.kiosk);

  ipcMain.handle('show-save-dialog', async (event, options) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, options);
    return !canceled ? filePath : null;
  });

  ipcMain.handle('show-open-dialog', async (event, options) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, options);
    return !canceled ? filePaths[0] : null;
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