const { generateImage, generateSummary } = require("./calls.js");

function splitFirstSpace(str) {
  const index = str.indexOf(" ");
  return [str.substring(0, index), str.substring(index + 1)];
}

async function processCommands(command) {
  let [cmd, args] = splitFirstSpace(command);

  if (["image", "img", "i"].includes(cmd)) {
    generateImage(args);
  } else if (["s", "sum", "summ", "summary"].includes(cmd)) {
    generateSummary(args);
  }
}

module.exports = {
  processCommands,
};
