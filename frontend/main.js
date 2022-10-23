// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const { executeCommand, navigateHistory } = require("./winfunctions.js");
const { x, off } = require("process");

const electron = require("electron");

function createWindow() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.11);

  const mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    transparent: true,
  });

  mainWindow.loadFile("index.html");

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type == "keyDown") {
      if (input.key === "Escape") {
        mainWindow.hide();
      } else if (input.key === "Enter") {
        executeCommand(mainWindow);
      } else if (input.key === "ArrowUp" || input.key === "ArrowDown") {
        let iter = input.key == "ArrowUp" ? -1 : 1;
        navigateHistory(mainWindow, iter);
      }
    }
  });

  // Open the DevTools.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

app.whenReady().then(() => {
  console.log("Ready");

  const ret = globalShortcut.register("CommandOrControl+Shift+C", () => {
    window = BrowserWindow.getAllWindows()[0];
    if (!window) {
      createWindow();
    } else {
      window.show();
    }
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
