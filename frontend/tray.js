const { app, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const { processCommands } = require('./commands.js');

let tray = null;

function createTray() {
  tray = new Tray(path.join(__dirname, '/views/tray.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: async () => {
        processCommands('Settings');
      },
    },
    {
      label: 'Quit',
      click: async () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
}

const TRAY_ANIMATION_FRAMES = 18;
let trayInterval = null;

function setTrayLoading() {
  let index = 0;
  trayInterval = setInterval(() => {
    tray.setImage(path.join(__dirname, `/views/Loading/${index}.png`));
    index = (index + 1) % TRAY_ANIMATION_FRAMES;
  }, 1000 / TRAY_ANIMATION_FRAMES);
}
function stopTrayLoading() {
  clearInterval(trayInterval);
  tray.setImage(path.join(__dirname, '/views/tray.png'));
}

module.exports = {
  createTray,
  setTrayLoading,
  stopTrayLoading,
};
