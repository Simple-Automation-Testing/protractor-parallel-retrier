"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpecFilesList = void 0;
const fs = require("fs");
const process_rerun_1 = require("process-rerun");
const utils_1 = require("./utils");
function getSpecFilesList(specsFolderPath, pattern) {
    if (!fs.existsSync(specsFolderPath)) {
        throw new Error(`${specsFolderPath} folder does not exists`);
    }
    if (pattern && !utils_1.isRegExp(pattern) && !utils_1.isString(pattern)) {
        throw new Error(`pattern should be string or RegExp`);
    }
    if (utils_1.isString(pattern)) {
        pattern = new RegExp(pattern, 'ig');
    }
    const specList = process_rerun_1.getFilesList(specsFolderPath);
    if (pattern) {
        return specList.filter((specPath) => specPath.match(pattern));
    }
    return specList;
}
exports.getSpecFilesList = getSpecFilesList;
//# sourceMappingURL=testlist.js.map