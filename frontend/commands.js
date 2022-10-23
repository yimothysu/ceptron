const {
  generateImage,
  generateSummary,
  generateTextCompletion,
} = require("./calls.js");
const { cache } = require("./cache.js");

function splitFirstSpace(str) {
  const index = str.indexOf(" ");
  return [str.substring(0, index), str.substring(index + 1)];
}

function imageCommand(cmd, args) {
  if (args.length == 0) {
    return "Error: Invalid Arguments";
  }
  return generateImage(args);
}

function summaryCommand(cmd, args) {
  let output = "Error: Invalid Arguments";
  let argRay = args.split(" ");
  if (argRay.length <= 1) {
    if (args.length == 0 || !isNaN(argRay[0])) return output;
    output = generateSummary(args);
  } else if (isNaN(argRay[1]) && !isNaN(argRay[0])) {
    output = generateSummary(argRay[1], argRay[0]);
  }
  return output;
}

function predictText(cmd, args) {
  if (!isNaN(args[0])) {
    let [tok, prompt] = splitFirstSpace(args);
    let max_tokens = parseInt(tok);
    return generateTextCompletion(prompt, max_tokens);
  }
  return generateTextCompletion(args);
}

async function processCommands(command) {
  if (cache.has(command)) {
    return cache.get(command);
  }
  let [cmd, args] = splitFirstSpace(command);
  cmd = cmd.toLowerCase();
  if (["image", "img", "i"].includes(cmd)) {
    return imageCommand(cmd, args);
  } else if (["s", "sum", "summ", "summary", "summarize"].includes(cmd)) {
    return summaryCommand(cmd, args);
  } else if (["c", "complete"].includes(cmd)) {
    return predictText(cmd, args);
  } else if (["help", "h"].includes(command) || ["help", "h"].includes(cmd)) {
    return "help";
  } else if (
    ["history", "hist"].includes(command) ||
    ["history", "hist"].includes(cmd)
  ) {
    return "history";
  }
  return "Error: Invalid Command";
}

module.exports = {
  processCommands,
};
