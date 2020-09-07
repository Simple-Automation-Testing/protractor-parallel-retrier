"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mochaJasminePatternApostrophe = exports.mochaJasminePatternDoubleQuote = exports.mochaJasminePatternSingleQuote = void 0;
const mochaJasminePatternSingleQuote = /(?<=it\(').+(?=')/ig;
exports.mochaJasminePatternSingleQuote = mochaJasminePatternSingleQuote;
const mochaJasminePatternDoubleQuote = /(?<=it\(").+(?=")/ig;
exports.mochaJasminePatternDoubleQuote = mochaJasminePatternDoubleQuote;
const mochaJasminePatternApostrophe = /(?<=it\(`).+(?=`)/ig;
exports.mochaJasminePatternApostrophe = mochaJasminePatternApostrophe;
//# sourceMappingURL=mocha.jasmine.grepper.js.map