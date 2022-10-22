const { generateImage, generateSummary } = require("./calls.js");

function processCommands(command) {
  if (command.startsWith("/generate_image(")) {
    generateImage(
      command.substring(command.indexOf("(") + 1, command.length - 1)
    );
  }
}

module.exports = {
  processCommands,
};
