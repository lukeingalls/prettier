"use strict";

// eslint-disable-next-line no-restricted-modules
const core = require("./core");

function run(filenames) {
  return main(filenames, console);
}

function main(rawArguments, logger) {
  const context = new core.Context({ rawArguments, logger });
  const output = core.formatFiles(context);
  return output;
}

module.exports = {
  run,
};
