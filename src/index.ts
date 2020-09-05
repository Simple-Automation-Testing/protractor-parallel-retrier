import * as fs from 'fs';
import {buildRunner, IBuildOpts} from 'process-rerun';
import {getSpecFilesList} from './testlist';
import {buildCommand} from './command';
import {isRegExp} from './utils';
import {mochaJasminePattern} from './mocha.jasmine.grepper';

function buildExecutor(pathToConfig: string, pathToSpecsFolder: string | string[], byItSpec: {mocha?: RegExp, jasmine?: RegExp} = {}) {
  if (!fs.existsSync(pathToConfig)) {
    throw new Error(`${pathToConfig} path to config`);
  }

  if (!Array.isArray(pathToSpecsFolder) && !fs.existsSync(pathToSpecsFolder)) {
    throw new Error(`${pathToSpecsFolder} path to specs`);
  }

  const files = Array.isArray(pathToSpecsFolder) ? pathToSpecsFolder : getSpecFilesList(pathToSpecsFolder);

  return {
    command: function(runArgs: {[k: string]: string} = {}, envVars: {[k: string]: string} = {}) {

      let commands = [];

      if (byItSpec.mocha) {
        if (!isRegExp(byItSpec.mocha)) {
          throw new Error(`byItSpec.mocha should be regex, current value is - ${byItSpec.mocha}`)
        }
        files.forEach((specFilePath) => {
          const content = fs.readFileSync(specFilePath, {encoding: 'utf8'});
          const grepOpts = content.match(byItSpec.mocha)
          if (grepOpts) {
            grepOpts.forEach((itName) => {
              runArgs['--mochaOpts.grep'] = `'${itName}'`;
              const cmd = buildCommand(pathToConfig, specFilePath, runArgs, envVars)
              commands.push(cmd);
            })
          }
        })
      } else {
        commands.push(...files.map((specFilePath) => {
          return buildCommand(pathToConfig, specFilePath, runArgs, envVars);
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

export {
  buildExecutor
}