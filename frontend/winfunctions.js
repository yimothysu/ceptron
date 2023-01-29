const { clipboard, nativeImage, shell } = require("electron");
const {
  createHistory,
  createHelpPage,
  createConfirmationWindow,
} = require("./windows.js");
const { processCommands } = require("./commands.js");
const { cache } = require("./cache.js");
const { history } = require("./history.js");

let historyIndex = 0;
const commands = [
  "prune",
  "clear",
  "history",
  "help",
  "instruct",
  "code",
  "image",
  "summarize",
  "settings",
];
let first = true;

function splitFirstSpace(str) {
  const index = str.indexOf(" ");
  return [str.substring(0, index), str.substring(index + 1)];
}

function executeCommand(mainWindow, cb) {
  // Input Command
  mainWindow.hide();
  mainWindow.webContents
    .executeJavaScript(`document.querySelector('#cmdField').value`, true)
    .then(function (command) {
      history.push(command);
      historyIndex++;
      processCommands(command).then((output) => {
        cb();
        cache.set(command, output);
        let [cmd, args] = splitFirstSpace(command);
        if (cmd == "image") {
          shell.openExternal(output);
        } else {
          if (output.startsWith("Error: ")) {
            if (command !== "") {
              createConfirmationWindow(output, err=true);
            }
          } else if (output === "Cache Cleared!") {
            createConfirmationWindow(output);
          } else if (output === "History Cleared!") {
            createConfirmationWindow(output);
            historyIndex = 0;
          } else if (output !== "No Output"){
            // Fires after Summary API Call
            clipboard.writeText(output);
            createConfirmationWindow("Copied to Clipboard!");
          }
        }
      });
    });
  mainWindow.webContents.executeJavaScript(
    `document.querySelector('#cmdField').value = ""`,
    true
  );
}

function autoComplete(mainWindow) {
  mainWindow.webContents
    .executeJavaScript(`document.querySelector('#cmdField').value`, true)
    .then((query) => {
      //console.log("querying: " + query);
      let autocomp = query;
      if (query === "") {
        autocomp = "help";
      } else {
        commands.forEach((cmd) => {
          if (cmd.startsWith(query)) autocomp = cmd + " ";
        });
      }
      mainWindow.webContents.executeJavaScript(
        `document.querySelector('#cmdField').value = "${autocomp}";
        length = document.querySelector('#cmdField').value.length;
        document.querySelector('#cmdField').focus()`
      );
    });
}

function predictive(mainWindow, input) {
  mainWindow.webContents
    .executeJavaScript(`document.querySelector('#cmdField').value`, true)
    .then((query) => {
      if (first === true) {
        first = false;
        query = input.key;
      } else if (input.key === "Backspace") {
        query = query.slice(0, query.length - 1);
      } else if (input.key.length > 1) {
        query = query;
      } else {
        query = query + input.key;
      }
      mainWindow.webContents
        .executeJavaScript(`document.querySelector('#cmdField').value`, true)
        .then((value) => {
          if (value === "") {
            mainWindow.webContents.executeJavaScript(
              `document.querySelector('#cmdFieldDisabled').disabled = true;
              document.querySelector('#cmdFieldDisabled').style.visibility = 'hidden';`,
              true
            );
          }
        });
      prediction = "";
      commands.forEach((cmd) => {
        if (cmd.startsWith(query)) {
          prediction = cmd;
        }
        if (query === "" || prediction === "") {
          mainWindow.webContents.executeJavaScript(
            `document.querySelector('#cmdFieldDisabled').disabled = true;
            document.querySelector('#cmdFieldDisabled').style.visibility = 'hidden';`,
            true
          );
        } else {
          mainWindow.webContents.executeJavaScript(
            `document.querySelector('#cmdFieldDisabled').value = "${prediction}";
            document.querySelector('#cmdFieldDisabled').disabled = false;
            document.querySelector('#cmdFieldDisabled').style.visibility = 'visible';`,
            true
          );
        }
      });
    });
}

function navigateHistory(mainWindow, iter) {
  if (historyIndex + iter <= history.length) {
    historyIndex = historyIndex + iter;
  }
  mainWindow.webContents.executeJavaScript(
    `document.querySelector('#cmdFieldDisabled').value = ""`,
    true
  );
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
  autoComplete,
  navigateHistory,
  predictive,
};
