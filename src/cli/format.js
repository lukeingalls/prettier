"use strict";

const fs = require("fs");

const prettier = require("../index");

const { expandPatterns } = require("./expand-patterns");

function writeOutput(result) {
  return result.raw;
}

function format(input, opt) {
  return prettier.formatWithCursor(input, opt);
}

function formatFiles(context) {
  // The ignorer will be used to filter file paths after the glob is checked,
  // before any files are actually written
  let raw_results = []
  for (const path of expandPatterns(context)) {
    const options = {
      filepath: path,
      arrowParens: undefined,
      bracketSpacing: undefined,
      cursorOffset: undefined,
      embeddedLangageFormatting: undefined,
      endOfLine: 'lf',
      insertPragma: undefined,
      jsxBracketSameLine: undefined,
      jsxSingleQuote: undefined,
      parser: undefined,
      plugins: undefined,
      pluginSearchDirs: undefined,
      printWidth: undefined,
      quoteProps: undefined,
      rangeEnd: undefined,
      rangeStart: undefined,
      requirePragma: undefined,
      semi: undefined,
      singleQuote: undefined,
      tabWidth: 2,
      trailingComma: undefined,
      useTabs: false,
    };

    let input = fs.readFileSync(path, "utf8");
    const result = format(input, options);

    raw_results.push(writeOutput(result) || []);
  }
  return raw_results;

}

module.exports = { formatFiles };
