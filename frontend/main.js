// Modules to control application life and create native browser window
const { processCommands } = require("./commands.js");
const { app, BrowserWindow, globalShortcut, clipboard } = require("electron");
const path = require("path");
const { x } = require("process");

const electron = require("electron");

function createCopyConfirmation(success) {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.11);

  const copyWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    transparent: true,
  });
  copyWindow.loadFile("copy.html");

  if (!success) {
    console.log("Not success");
    copyWindow.webContents.executeJavaScript(
      `document.querySelector('#copiedToClipboard').textContent = "Error: Command Not Found"`,
      true
    );
  }

  setTimeout(() => {
    copyWindow.close();
  }, 750);
}

function createWindow() {
  // Create the browser window.
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
  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // copiedWindow.loadFile("copy.html");
  // copiedWindow.hide();
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.key === "Escape") {
      mainWindow.hide();
    } else if (input.key === "Enter") {
      mainWindow.hide();
      mainWindow.webContents
        .executeJavaScript(`document.querySelector('#cmdField').value`, true)
        .then(function (result) {
          processCommands(result).then((output) => {
            console.log(output);
            if (output == "Error Finding Command") {
              createCopyConfirmation(false);
            } else {
              if (typeof output == "string") {
                clipboard.writeText(output);
                createCopyConfirmation(true);
              } else clipboard.writeImage(output);
            }
          });
          //       copiedWindow.show();
        });
      mainWindow.webContents.executeJavaScript(
        `document.querySelector('#cmdField').value = ""`,
        true
      );
    }
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.

app.whenReady().then(() => {
  console.log("Ready");
  const ret = globalShortcut.register("CommandOrControl+Shift+C", () => {
    if (!BrowserWindow.getAllWindows()[0]) {
      createWindow();
    } else {
      BrowserWindow.getAllWindows()[0].show();
    }
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
