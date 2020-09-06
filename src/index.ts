import * as fs from 'fs';
import {buildRunner, IBuildOpts} from 'process-rerun';
import {getSpecFilesList} from './testlist';
import {buildCommand} from './command';
import {isRegExp} from './utils';
import {mochaJasminePatternDoubleQuote, mochaJasminePatternSingleQuote} from './mocha.jasmine.grepper';

function getGrepArgument(framework) {
  switch (framework) {
    case 'jasmine':
      return '--jasmineNodeOpts.grep';
    case 'mocha':
      return '--mochaOpts.grep';
    default:
      return '--jasmineNodeOpts.grep'
  }
}

interface IOpts {
  pattern?: RegExp;
  queue?: string[];
  grepArgument?: '--mochaOpts.grep' | '--jasmineNodeOpts.grep';
}

function next(configPath, specsDirPath, opts: IOpts = {}) {
  if (!Array.isArray(specsDirPath) && !fs.existsSync(specsDirPath)) {
    throw new Error(`${specsDirPath} path to specs`);
  }

  const files = Array.isArray(specsDirPath) ? specsDirPath : getSpecFilesList(specsDirPath);

  return {
    command: function(runArgs: {[k: string]: string} | null = {}, envVars: {[k: string]: string} = {}) {
      if (runArgs === null) {
        runArgs = {};
      }
      if (!envVars) {
        envVars = {};
      }
      let commands = [];
      if (opts.pattern && opts.queue) {
        for (const queued of opts.queue) {
          files.forEach((specFilePath) => {
            const content = fs.readFileSync(specFilePath, {encoding: 'utf8'});
            const grepOpts = content.match(opts.pattern as RegExp);
            if (grepOpts) {
              const itName = grepOpts.find((itName) => itName === queued);
              if (itName) {
                runArgs[opts.grepArgument] = `'${itName}'`;
                const cmd = buildCommand(configPath, specFilePath, runArgs, envVars);
                commands.push(cmd);
              }
            }
          })
        }
      } else if (opts.pattern) {
        files.forEach((specFilePath) => {
          const content = fs.readFileSync(specFilePath, {encoding: 'utf8'});
          const grepOpts = content.match(opts.pattern as RegExp);
          if (grepOpts) {
            grepOpts.forEach((itName) => {
              runArgs[opts.grepArgument] = `'${itName}'`;
              const cmd = buildCommand(configPath, specFilePath, runArgs, envVars);
              commands.push(cmd);
            });
          }
        });
      } else {
        commands.push(...files.map((specFilePath) => {
          return buildCommand(configPath, specFilePath, runArgs, envVars);
        }));
      }
      return {
        executor: function(runnerOpts: IBuildOpts): {execute: () => Promise<{notRetriable: string[], retriable: string[]}>} {
          const runner = buildRunner(runnerOpts);
          return {
            execute: () => runner(commands)
          }
        }
      }
    }
  }
}

function buildExecutor(pathToConfig: string, configPath: string | string[]) {
  const supportedFrameworks = ['jasmine', 'mocha', 'jasmine2']
  if (!fs.existsSync(pathToConfig)) {
    throw new Error(`${pathToConfig} path to config`);
  }

  let framework = null;
  const confgiModule = require(pathToConfig);
  if (confgiModule.config && confgiModule.config.framework) {
    framework = confgiModule.config.framework;
  } else if (confgiModule.framework) {
    framework = confgiModule.framework;
  } else if (confgiModule.conf && confgiModule.conf.framework) {
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
    byIt: function(pattern: RegExp) {
      if (!isRegExp(pattern)) {
        throw new Error(`pattern should be regexp`);
      }
      return next(pathToConfig, configPath, {pattern, grepArgument: getGrepArgument(framework)});
    },
    byFile: function() {
      return next(pathToConfig, configPath);
    },
    asQueue: function(pattern: RegExp, queue: string[]) {
      if (!isRegExp(pattern)) {
        throw new Error(`pattern should be regexp`);
      }
      if (!Array.isArray(queue)) {
        throw new Error(`queue should be string[]`);
      }
      return next(pathToConfig, configPath, {pattern, grepArgument: getGrepArgument(framework), queue});
    }
  }
}

export {
  buildExecutor,
  mochaJasminePatternDoubleQuote,
  mochaJasminePatternSingleQuote
}