"use strict";

const {
  printer: { printDocToString },
} = require("../document");
const {
  guessEndOfLine,
  countEndOfLineChars,
  normalizeEndOfLine,
} = require("../common/end-of-line");
const normalizeOptions = require("./options").normalize;
const comments = require("./comments");
const parser = require("./parser");
const printAstToDoc = require("./ast-to-doc");

const BOM = "\uFEFF";

function attachComments(text, ast, opts) {
  const astComments = ast.comments;
  if (astComments) {
    delete ast.comments;
    comments.attach(astComments, ast, text, opts);
  }
  opts[Symbol.for("comments")] = astComments || [];
  opts[Symbol.for("tokens")] = ast.tokens || [];
  opts.originalText = text;
  return astComments;
}

function coreFormat(originalText, opts) {
  const { ast, text } = parser.parse(originalText, opts);

  const astComments = attachComments(text, ast, opts);
  const doc = printAstToDoc(ast, opts);

  const { formatted, raw } = printDocToString(doc, opts);

  return {
   formatted,
    raw,
    cursorOffset: -1,
    comments: astComments,
  };
}

function ensureIndexInText(text, index, defaultValue) {
  if (
    typeof index !== "number" ||
    Number.isNaN(index) ||
    index < 0 ||
    index > text.length
  ) {
    return defaultValue;
  }

  return index;
}

function normalizeIndexes(text, options) {
  let { cursorOffset, rangeStart, rangeEnd } = options;
  cursorOffset = ensureIndexInText(text, cursorOffset, -1);
  rangeStart = ensureIndexInText(text, rangeStart, 0);
  rangeEnd = ensureIndexInText(text, rangeEnd, text.length);

  return { ...options, cursorOffset, rangeStart, rangeEnd };
}

function normalizeInputAndOptions(text, options) {
  let { cursorOffset, rangeStart, rangeEnd, endOfLine } = normalizeIndexes(
    text,
    options
  );

  const hasBOM = text.charAt(0) === BOM;

  if (hasBOM) {
    text = text.slice(1);
    cursorOffset--;
    rangeStart--;
    rangeEnd--;
  }

  if (endOfLine === "auto") {
    endOfLine = guessEndOfLine(text);
  }

  // get rid of CR/CRLF parsing
  if (text.includes("\r")) {
    const countCrlfBefore = (index) =>
      countEndOfLineChars(text.slice(0, Math.max(index, 0)), "\r\n");

    cursorOffset -= countCrlfBefore(cursorOffset);
    rangeStart -= countCrlfBefore(rangeStart);
    rangeEnd -= countCrlfBefore(rangeEnd);

    text = normalizeEndOfLine(text);
  }

  return {
    hasBOM,
    text,
    options: normalizeIndexes(text, {
      ...options,
      cursorOffset,
      rangeStart,
      rangeEnd,
      endOfLine,
    }),
  };
}

function formatWithCursor(originalText, originalOptions) {
  let { text, options } = normalizeInputAndOptions(
    originalText,
    normalizeOptions(originalOptions)
  );

  return coreFormat(text, options);
}

module.exports = {
  formatWithCursor,
};
