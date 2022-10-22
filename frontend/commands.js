const { generateImage, generateSummary } = require("./calls.js");

function splitFirstSpace(str) {
  const index = str.indexOf(" ");
  return [str.substring(0, index), str.substring(index + 1)];
}

function processCommands(command) {
  let [cmd, args] = splitFirstSpace(command);

  if (["image", "img", "i"].includes(cmd)) {
    generateImage(args);
  }
}

module.exports = {
  processCommands,
};
