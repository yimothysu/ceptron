const electron = require("electron");
const { BrowserWindow, clipboard } = require("electron");
const path = require("path");
const { history } = require("./history.js");

function createHistory() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.32);
  const historyWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    title: "History",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    transparent: true,
  });
  historyWindow.loadFile("views/history.html");
  let index = 0;
  history
    .slice()
    .reverse()
    .forEach((item) => {
      if (index < history.length) {
        historyWindow.webContents.executeJavaScript(
          `document.querySelector("#commandHistory").insertAdjacentHTML("beforeend", "<div class='cmd' id='cmd${index++}'>${item}</div>")`,
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
        createConfirmationWindow("Copied to Clipboard!");
        historyWindow.close();
      } else if (input.key === "ArrowDown" || input.key === "ArrowUp") {
        historyWindow.webContents.executeJavaScript(
          `document.querySelector('#cmd${index}').style.backgroundColor = "white"`,
          true
        );
        if (input.key === "ArrowDown" && index < history.length - 1) index++;
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
    title: "Help",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    transparent: true,
    frame: false,
  });
  helpWindow.loadFile("views/help.html");

  helpWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type == "keyDown") {
      if (input.key === "Escape") {
        helpWindow.close();
      }
    }
  });
}

function createSettings() {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.5);

  const settingsWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    title: "Settings",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    transparent: true,
    frame: false,
  });
  settingsWindow.loadFile("views/settings.html");

}

function createConfirmationWindow(msg, err=false) {
  const screenDimensions = electron.screen.getPrimaryDisplay().size;
  const windowWidth = Math.round(screenDimensions.width * 0.6);
  const windowHeight = Math.round(screenDimensions.height * 0.11);

  const confirmationWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    transparent: true,
  });
  confirmationWindow.loadFile("views/confirm.html");
  setTimeout(() => {
    confirmationWindow.focus();
  }, 200);

  confirmationWindow.webContents.executeJavaScript(
    `document.querySelector('#copiedToClipboard').textContent = "${msg}"`,
    true
  );

  if (err) {
    confirmationWindow.webContents.executeJavaScript(
      `document.querySelector('#copiedToClipboard').style.color = "red"`,
      true
    );
  }

  setTimeout(() => {
    confirmationWindow.close();
  }, 600);
}

module.exports = {
  createHistory,
  createHelpPage,
  createSettings,
  createConfirmationWindow,
};
