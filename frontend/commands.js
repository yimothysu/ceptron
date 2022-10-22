const { generateImage, generateSummary } = require("./calls.js");

function splitFirstSpace(str) {
  const index = str.indexOf(" ");
  return [str.substring(0, index), str.substring(index + 1)];
}

async function processCommands(command) {
  let [cmd, args] = splitFirstSpace(command);
  let output = "Error Finding Command";
  if (["image", "img", "i"].includes(cmd)) {
    output = generateImage(args);
  } else if (["s", "sum", "summ", "summary"].includes(cmd)) {
    output = generateSummary(args);
  }
  return output;
}

module.exports = {
  processCommands,
};
