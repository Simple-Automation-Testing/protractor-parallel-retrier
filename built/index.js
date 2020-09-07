"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mochaJasminePatternSingleQuote = exports.mochaJasminePatternDoubleQuote = exports.buildExecutor = void 0;
const fs = require("fs");
const process_rerun_1 = require("process-rerun");
const testlist_1 = require("./testlist");
const command_1 = require("./command");
const mocha_jasmine_grepper_1 = require("./mocha.jasmine.grepper");
Object.defineProperty(exports, "mochaJasminePatternDoubleQuote", { enumerable: true, get: function () { return mocha_jasmine_grepper_1.mochaJasminePatternDoubleQuote; } });
Object.defineProperty(exports, "mochaJasminePatternSingleQuote", { enumerable: true, get: function () { return mocha_jasmine_grepper_1.mochaJasminePatternSingleQuote; } });
function getPattern(content) {
    const itPattern = /(?<=it\()./ig;
    const matched = content.match(itPattern);
    if (matched) {
        const char = matched[0];
        switch (char) {
            case "'":
                return mocha_jasmine_grepper_1.mochaJasminePatternSingleQuote;
            case '"':
                return mocha_jasmine_grepper_1.mochaJasminePatternDoubleQuote;
            case '`':
                return mocha_jasmine_grepper_1.mochaJasminePatternApostrophe;
            default:
                return mocha_jasmine_grepper_1.mochaJasminePatternDoubleQuote;
        }
    }
}
function getGrepArgument(framework) {
    switch (framework) {
        case 'jasmine':
            return '--jasmineNodeOpts.grep';
        case 'mocha':
            return '--mochaOpts.grep';
        default:
            return '--jasmineNodeOpts.grep';
    }
}
function next(configPath, specsDirPath, opts = {}) {
    if (!Array.isArray(specsDirPath) && !fs.existsSync(specsDirPath)) {
        throw new Error(`${specsDirPath} path to specs`);
    }
    const files = Array.isArray(specsDirPath) ? specsDirPath : testlist_1.getSpecFilesList(specsDirPath);
    return {
        command: function (runArgs = {}, envVars = {}) {
            if (runArgs === null) {
                runArgs = {};
            }
            if (!envVars) {
                envVars = {};
            }
            let commands = [];
            if (opts.by === 'queue') {
                for (const queued of opts.queue) {
                    files.forEach((specFilePath) => {
                        const content = fs.readFileSync(specFilePath, { encoding: 'utf8' });
                        opts.pattern = opts.pattern || getPattern(content);
                        const grepOpts = content.match(opts.pattern);
                        if (grepOpts) {
                            const itName = grepOpts.find((itName) => itName === queued);
                            if (itName) {
                                runArgs[opts.grepArgument] = `'${itName}'`;
                                const cmd = command_1.buildCommand(configPath, specFilePath, runArgs, envVars);
                                commands.push(cmd);
                            }
                        }
                    });
                }
            }
            else if (opts.by === 'it') {
                files.forEach((specFilePath) => {
                    const content = fs.readFileSync(specFilePath, { encoding: 'utf8' });
                    opts.pattern = opts.pattern || getPattern(content);
                    const grepOpts = content.match(opts.pattern);
                    if (grepOpts) {
                        grepOpts.forEach((itName) => {
                            runArgs[opts.grepArgument] = `'${itName}'`;
                            const cmd = command_1.buildCommand(configPath, specFilePath, runArgs, envVars);
                            commands.push(cmd);
                        });
                    }
                });
            }
            else {
                commands.push(...files.map((specFilePath) => {
                    return command_1.buildCommand(configPath, specFilePath, runArgs, envVars);
                }));
            }
            return {
                executor: function (runnerOpts) {
                    const runner = process_rerun_1.buildRunner(runnerOpts);
                    return {
                        execute: () => runner(commands)
                    };
                }
            };
        }
    };
}
function buildExecutor(pathToConfig, configPath) {
    const supportedFrameworks = ['jasmine', 'mocha', 'jasmine2'];
    if (!fs.existsSync(pathToConfig)) {
        throw new Error(`${pathToConfig} path to config`);
    }
    let framework = null;
    const confgiModule = require(pathToConfig);
    if (confgiModule.config && confgiModule.config.framework) {
        framework = confgiModule.config.framework;
    }
    else if (confgiModule.framework) {
        framework = confgiModule.framework;
    }
    else if (confgiModule.conf && confgiModule.conf.framework) {
        framework = confgiModule.conf.framework;
    }
    if (!supportedFrameworks.includes(framework)) {
        throw new Error(`
      Not supported framework,
      supported frameworks are: ${supportedFrameworks.join(', ')},
      Development in process, will be implemented in future
    `);
    }
    return {
        byIt: function (pattern) {
            return next(pathToConfig, configPath, {
                pattern,
                grepArgument: getGrepArgument(framework),
                by: 'it',
            });
        },
        byFile: function () {
            return next(pathToConfig, configPath);
        },
        asQueue: function (patternOrQueue, queue) {
            if (arguments.length === 1) {
                queue = patternOrQueue;
                patternOrQueue = null;
            }
            if (!Array.isArray(queue)) {
                throw new Error(`queue should be string[]`);
            }
            return next(pathToConfig, configPath, {
                pattern: patternOrQueue,
                grepArgument: getGrepArgument(framework),
                queue,
                by: 'queue',
            });
        }
    };
}
exports.buildExecutor = buildExecutor;
//# sourceMappingURL=index.js.map