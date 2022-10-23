const electron = require("electron");
const { BrowserWindow, clipboard } = require("electron");
const path = require("path");
const { history } = require("./history.js");

function createSpinner() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.25);
  const windowHeight = Math.round(screenDimensions.height * 0.25);
  const spinnerWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    transparent: true,
  });
  spinnerWindow.loadFile("spinner.html");
  return spinnerWindow;
}

function destroySpinner(window) {
  window.close();
}

function createHistory() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.32);
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

  let index = 0;
  history
    .slice()
    .reverse()
    .forEach((item) => {
      if (index < 8) {
        historyWindow.webContents.executeJavaScript(
          `document.querySelector("#cmd${index++}").innerText = "${item}"`,
          true
        );
      }
    });
  historyWindow.webContents.executeJavaScript(
    `document.querySelector('#cmd0').style.backgroundColor = "lightblue"`,
    true
  );
  index = 0;
  historyWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type == "keyDown") {
      if (input.key === "Escape") {
        historyWindow.close();
      } else if (input.key === "Enter") {
        historyWindow.webContents
          .executeJavaScript(
            `document.querySelector('#cmd${index}').textContent`,
            true
          )
          .then((output) => {
            clipboard.writeText(output);
          });
        createCopyConfirmation();
        historyWindow.close();
      } else if (input.key === "ArrowDown" || input.key === "ArrowUp") {
        historyWindow.webContents.executeJavaScript(
          `document.querySelector('#cmd${index}').style.backgroundColor = "white"`,
          true
        );
        if (input.key === "ArrowDown" && index < 7) index++;
        else if (input.key === "ArrowUp" && index > 0) index--;
        historyWindow.webContents.executeJavaScript(
          `document.querySelector('#cmd${index}').style.backgroundColor = "lightblue"`,
          true
        );
      }
    }
  });
}

function createHelpPage() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height);

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
  setTimeout(() => {
    copyWindow.focus();
  }, 200);

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
  }, 600);
}

module.exports = {
  createHistory,
  createHelpPage,
  createCopyConfirmation,
  createSpinner,
  destroySpinner,
};
