"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mochaJasminePatternDoubleQuote = exports.mochaJasminePatternSingleQuote = void 0;
const mochaJasminePatternSingleQuote = new RegExp(`(?<=it\\(')(.*)(\\')`, 'ig');
exports.mochaJasminePatternSingleQuote = mochaJasminePatternSingleQuote;
const mochaJasminePatternDoubleQuote = new RegExp(`(?<=it\\(")(.*)(\\")`, 'ig');
exports.mochaJasminePatternDoubleQuote = mochaJasminePatternDoubleQuote;
//# sourceMappingURL=mocha.jasmine.grepper.js.map