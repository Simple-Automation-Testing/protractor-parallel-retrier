const mochaJasminePatternSingleQuote = new RegExp(`(?<=it\\(')(.*)(\\')`, 'ig');
const mochaJasminePatternDoubleQuote = new RegExp(`(?<=it\\(")(.*)(\\")`, 'ig');

export {
  mochaJasminePatternSingleQuote,
  mochaJasminePatternDoubleQuote
}