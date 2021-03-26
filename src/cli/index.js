"use strict";

// eslint-disable-next-line no-restricted-modules
const core = require("./core");

function run(rawArguments) {
  main(rawArguments, console);
}

function main(rawArguments, logger) {
  const context = new core.Context({ rawArguments, logger });
  core.formatFiles(context);
}

module.exports = {
  run,
};
