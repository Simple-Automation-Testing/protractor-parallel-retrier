"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = void 0;
const path = require("path");
function buildCommand(configPath, specFilePath, runArgs = {}, envVars = {}) {
    const vars = Object.keys(envVars).reduce((acc, k) => {
        acc += `${k}=${envVars[k]} `;
        return acc;
    }, '');
    const args = Object.keys(runArgs).reduce((acc, k) => {
        const argPart = runArgs[k] === null ? `${k} ` : `${k}=${runArgs[k]} `;
        acc += argPart;
        return acc;
    }, '');
    const cmd = `${vars} ${path.resolve(process.cwd(), './node_modules/.bin/protractor')} ${configPath} --specs=${specFilePath} ${args}`;
    return cmd;
}
exports.buildCommand = buildCommand;
;
//# sourceMappingURL=command.js.map