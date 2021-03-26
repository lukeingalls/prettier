"use strict";

const core = require("./main/core");
const { getSupportInfo } = require("./main/support");
const plugins = require("./common/load-plugins");

function _withPlugins(
  fn,
  optsArgIdx = 1 // Usually `opts` is the 2nd argument
) {
  return (...args) => {
    const opts = args[optsArgIdx] || {};
    args[optsArgIdx] = {
      ...opts,
      plugins: plugins.loadPlugins(opts.plugins, opts.pluginSearchDirs),
    };
    return fn(...args);
  };
}

const formatWithCursor = _withPlugins(core.formatWithCursor);

module.exports = {
  formatWithCursor,

  getSupportInfo: _withPlugins(getSupportInfo, 0),

  // Internal shared
  __internal: {
  //   errors: require("./common/errors"),
    coreOptions: require("./main/core-options"),
    optionsModule: require("./main/options"),
    optionsNormalizer: require("./main/options-normalizer"),
    utils: {
      arrayify: require("./utils/arrayify"),
    },
  },
};
