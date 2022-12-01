const {
  generateImage,
  generateSummary,
  generateTextCompletion,
} = require("./calls.js");
const { cache } = require("./cache.js");
const { history } = require("./history.js");
const { createHistory, createHelpPage, createSettings } = require("./windows.js");

function splitFirstSpace(str) {
  const index = str.indexOf(" ");
  if(index == -1)
    return [str, ""]
  return [str.substring(0, index), str.substring(index + 1)];
}

const commandFunctions = new Map([
  ["image", imageCommand],
  ["summarize", summarizeCommand],
  ["instruct", predictText],
  ["prune", pruneCache],
  ["clear", clearHistory],
  ["help", createHelpPage],
  ["history", createHistory],
  ["settings", createSettings]
]);
const cachable = [
  "image",
  "instruct",
  "summarize"
]

function imageCommand(args) {
  if (args.length == 0) {
    return "Error: Invalid Arguments";
  }
  return generateImage(args);
}

function summarizeCommand(args) {
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

function predictText(args) {
  if (!isNaN(args[0])) {
    let [tok, prompt] = splitFirstSpace(args);
    let max_tokens = parseInt(tok);
    return generateTextCompletion(prompt, max_tokens);
  }
  return generateTextCompletion(args);
}

function pruneCache() {
  cache.clear();
  return "Cache Cleared!";
}

function clearHistory() {
  history.length = 0;
  return "History Cleared!";
}

async function processCommands(command) {
  let [cmd, args] = splitFirstSpace(command);
  cmd = cmd.toLowerCase();
  if (cache.has(command) && cachable.includes(cmd)) 
    return cache.get(command);
  if(!commandFunctions.has(cmd))
    return "Error: Invalid Command";
  return commandFunctions.get(cmd)(args) || "No Output";
}

module.exports = {
  processCommands,
};
