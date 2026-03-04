const { ipcRenderer } = require('electron');

// add a click handler to the set-directory button
document.getElementById('set-directory').addEventListener('click', async () => {
  console.log('Setting directory for sprite images...');
  const directory = await ipcRenderer.send('show-select-folder');
  if (directory) {
    console.log(`Selected directory: ${directory}`);
    // Here you can add logic to handle the selected directory, like displaying it or processing files.
  } else {
    console.log('No directory selected');
  }
});