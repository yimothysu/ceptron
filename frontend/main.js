// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut } = require('electron');
const { createTray } = require('./tray.js');
const { openCommandWindow } = require('./input.js');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

app.whenReady().then(() => {
  console.log('Ready');

  createTray();
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    openCommandWindow();
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  app.on('settings-change', () => {
    console.log('X');
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
