const { clipboard, nativeImage } = require("electron");
const {
  createHistory,
  createHelpPage,
  createCopyConfirmation,
  createSpinner,
} = require("./windows.js");
const { processCommands } = require("./commands.js");
const { cache } = require("./cache.js");
const { history } = require("./history.js");

let historyIndex = 0;
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
        cache.set(command, output);
        let [cmd, args] = splitFirstSpace(command);
        if (["i", "img", "image"].includes(cmd)) {
          console.log("IMAGE");
          console.log(output.length);
          const buffer = Buffer.from(output);
          const image = nativeImage.createFromBuffer(buffer);
          clipboard.writeImage(image);
          createCopyConfirmation();
          // cb();
        } else {
          if (output.startsWith("Error: ")) {
            if (command != "") {
              createCopyConfirmation(output);
            }
          } else if (output == "help") {
            createHelpPage();
          } else if (output == "history") {
            createHistory();
          } else {
            // Fires after Summary API Call
            clipboard.writeText(output);
            createCopyConfirmation();
          }
        }
        cb();
      });
    });
  mainWindow.webContents.executeJavaScript(
    `document.querySelector('#cmdField').value = ""`,
    true
  );
}

function autoComplete(mainWindow) {
  let commands = ["image", "summarize", "help", "history"];
  mainWindow.webContents
    .executeJavaScript(`document.querySelector('#cmdField').value`, true)
    .then((query) => {
      //console.log("querying: " + query);
      if (query === "img") {
        query = "image ";
      } else {
        commands.forEach((cmd) => {
          if (cmd.startsWith(query)) query = cmd + " ";
        });
      }
      mainWindow.webContents.executeJavaScript(
        `document.querySelector('#cmdField').value = "${query}"`
      );
      mainWindow.webContents
        .executeJavaScript(
          `document.querySelector('#cmdField').value.length`,
          true
        )
        .then((length) => {
          mainWindow.webContents.executeJavaScript(
            `document.querySelector('#cmdField').setSelectionRange(${length}, ${length})`,
            true
          );
        });
    });
}

function predictive(mainWindow, input) {
  let commands = ["image", "summarize", "help", "history"];
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
              `document.querySelector('#cmdFieldDisabled').disabled = true`,
              true
            );
            mainWindow.webContents.executeJavaScript(
              `document.querySelector('#cmdFieldDisabled').style.visibility = 'hidden'`,
              true
            );
          }
        });
      // mainWindow.webContents.openDevTools();
      //console.log("query: " + query);
      prediction = "";
      commands.forEach((cmd) => {
        if (cmd.startsWith(query)) {
          console.log("query: " + query);
          console.log("cmd: " + cmd + "\n");
          prediction = cmd;
        }
        if (query === "" || prediction === "") {
          mainWindow.webContents.executeJavaScript(
            `document.querySelector('#cmdFieldDisabled').disabled = true`,
            true
          );
          mainWindow.webContents.executeJavaScript(
            `document.querySelector('#cmdFieldDisabled').style.visibility = 'hidden'`,
            true
          );
        } else {
          mainWindow.webContents.executeJavaScript(
            `document.querySelector('#cmdFieldDisabled').value = "${prediction}"`,
            true
          );
          mainWindow.webContents.executeJavaScript(
            `document.querySelector('#cmdFieldDisabled').disabled = false`,
            true
          );
          mainWindow.webContents.executeJavaScript(
            `document.querySelector('#cmdFieldDisabled').style.visibility = 'visible'`,
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
