const { clipboard } = require("electron");
const {
  createHistory,
  createHelpPage,
  createCopyConfirmation,
} = require("./windows.js");
const { processCommands } = require("./commands.js");
const { cache } = require("./cache.js");
const { history } = require("./history.js");

const electron = require("electron");

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
        } else if (output == "history") {
          createHistory();
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

module.exports = {
  executeCommand,
  navigateHistory,
};