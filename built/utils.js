"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRegExp = exports.isString = void 0;
function isString(arg) {
    return Object.prototype.toString.call(arg) === '[object String]';
}
exports.isString = isString;
function isRegExp(arg) {
    return Object.prototype.toString.call(arg) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
//# sourceMappingURL=utils.js.map