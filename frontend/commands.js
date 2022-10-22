const { generateImage, generateSummary } = require("./calls.js");
const { cache } = require("./cache.js");

function splitFirstSpace(str) {
  const index = str.indexOf(" ");
  return [str.substring(0, index), str.substring(index + 1)];
}

function imageCommand(cmd, args) {
  return generateImage(args);
}

function summaryCommand(cmd, args) {
  let output = "Error: Invalid Arguments";
  let argRay = args.split(" ");
  if (argRay.length == 1) {
    output = generateSummary(args[0]);
  } else if (isNaN(argRay[1]) && !isNaN(argRay[0])) {
    output = generateSummary(argRay[1], argRay[0]);
  }
  return output;
}

async function processCommands(command) {
  if (cache.has(command)) {
    return cache.get(command);
  }
  let [cmd, args] = splitFirstSpace(command);
  if (["image", "img", "i"].includes(cmd)) {
    return imageCommand(cmd, args);
  } else if (["s", "sum", "summ", "summary"].includes(cmd)) {
    return summaryCommand(cmd, args);
  } else if (["help", "h"].includes(command) || ["help", "h"].includes(cmd)) {
    return "help";
  }
  return "Error: Invalid Command";
}

module.exports = {
  processCommands,
};
