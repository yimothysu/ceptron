// Modules to control application life and create native browser window
const { processCommands } = require("./commands.js");
const { app, BrowserWindow, globalShortcut, clipboard } = require("electron");
const path = require("path");
const { x, off } = require("process");
const { cache } = require("./cache.js");
const { history } = require("./history.js");

const electron = require("electron");

function createHelpPage() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.5);

  const helpWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    transparent: true,
    frame: false,
  });
  helpWindow.loadFile("help.html");
}

let historyIndex = 0;

function executeCommand(mainWindow) {
  // Input Command
  mainWindow.hide();
  mainWindow.webContents
    .executeJavaScript(`document.querySelector('#cmdField').value`, true)
    .then(function (command) {
      history.push(command);
      historyIndex++;
      processCommands(command).then((output) => {
        cache.set(command, output);
        if (
          output == "Error: Invalid Command" ||
          output == "Error: Invalid Arguments"
        ) {
          if (command != "") {
            createCopyConfirmation(output);
          }
        } else if (output == "help") {
                createHelpPage();
        } else {
          if (typeof output == "string") {
            clipboard.writeText(output);
            createCopyConfirmation();
          } else clipboard.writeImage(output);
        }
      });
    });
  mainWindow.webContents.executeJavaScript(
    `document.querySelector('#cmdField').value = ""`,
    true
  );
}

function navigateHistory(mainWindow, iter) {
  if (historyIndex + iter <= history.length) {
    historyIndex = historyIndex + iter;
  }
  if (historyIndex < 0) historyIndex = 0;
  if (historyIndex == history.length) {
    mainWindow.webContents.executeJavaScript(
      `document.querySelector('#cmdField').value = ""`,
      true
    );
  } else {
    mainWindow.webContents.executeJavaScript(
      `document.querySelector('#cmdField').value = "${history[historyIndex]}"`,
      true
    );
  }
}

function createCopyConfirmation(err = "") {
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

  if (err) {
    copyWindow.webContents.executeJavaScript(
      `document.querySelector('#copiedToClipboard').textContent = "${err}"`,
      true
    );
    copyWindow.webContents.executeJavaScript(
      `document.querySelector('#copiedToClipboard').style.color = "red"`,
      true
    );
  }

  setTimeout(() => {
    copyWindow.close();
  }, 1000);
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
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type == "keyUp") {
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
  // mainWindow.webContents.openDevTools()
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
