const electron = require("electron");
const { BrowserWindow } = require("electron");
const path = require("path");
const { history } = require("./history.js");

function createHistory() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.3);
  const historyWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    transparent: true,
  });
  historyWindow.loadFile("history.html");

  historyWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type == "keyDown") {
      if (input.key === "Escape") {
        historyWindow.close();
      }
    }
  });

  history.forEach((item) => {
    console.log(item);
    // let itemHTML = `<div class="historyItem">${item}</div>`;
    let itemHTML = `<p>${item}</p>`;
    historyWindow.webContents.executeJavaScript(
      `document.querySelector('#commandHistory').innerHTML = document.querySelector('#commandHistory').innerHTML + "${itemHTML}"`,
      true
    );
  });
}

function createHelpPage() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.61);

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

  helpWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type == "keyDown") {
      if (input.key === "Escape") {
        helpWindow.close();
      }
    }
  });
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
  }, 500);
}

module.exports = {
  createHistory,
  createHelpPage,
  createCopyConfirmation,
};
