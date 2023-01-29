const { BrowserWindow, clipboard } = require('electron');
const path = require('path');
const {
  executeCommand,
  autoComplete,
  predictive,
  navigateHistory,
} = require('./winfunctions.js');

const electron = require('electron');
const { setTrayLoading, stopTrayLoading } = require('./tray.js');

function openCommandWindow() {
  clipboard.writeText('', 'selection')
  console.log(clipboard.readText('selection'));
  if (BrowserWindow.getAllWindows().length == 0) {
    createWindow();
  } else {
    window = BrowserWindow.getAllWindows()[0];
    let title = window.title;
    BrowserWindow.getAllWindows().forEach((window) => window.close());
    if (title !== 'Ceptron') {
      console.log('Created Window');
      createWindow();
    }
  }
}

function createWindow() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.11);

  const mainWindow = new BrowserWindow({
    width: windowWidth,
    title: 'Ceptron',
    height: windowHeight,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
    transparent: true,
  });

  mainWindow.webContents.executeJavaScript(
    `document.querySelector('#cmdFieldDisabled').value = "Enter command here";
      document.querySelector('#cmdFieldDisabled').disabled = false;
      document.querySelector('#cmdFieldDisabled').style.visibility = 'visible';`,
    true
  );

  mainWindow.loadFile('views/index.html');

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type == 'keyDown') {
      if (input.meta) {
        if (input.key.toLowerCase() === 'q') {
          event.preventDefault();
          mainWindow.close();
        }
      }
      if (input.key === 'Escape') {
        mainWindow.hide();
      } else if (input.key === 'Enter') {
        // Change this to a gif in the menu bar
        setTrayLoading();
        executeCommand(mainWindow, stopTrayLoading);
        mainWindow.close();
      } else if (input.key === 'ArrowUp' || input.key === 'ArrowDown') {
        let iter = input.key == 'ArrowUp' ? -1 : 1;
        navigateHistory(mainWindow, iter);
      } else if (input.key === 'Tab') {
        autoComplete(mainWindow);
      } else {
        predictive(mainWindow, input);
      }
    }
  });
}

module.exports = {
  createWindow,
  openCommandWindow,
};
