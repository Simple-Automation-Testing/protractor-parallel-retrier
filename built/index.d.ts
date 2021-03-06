import { IBuildOpts } from 'process-rerun';
import { mochaJasminePatternDoubleQuote, mochaJasminePatternSingleQuote } from './mocha.jasmine.grepper';
declare function buildExecutor(pathToConfig: string, specFolderPath: string | string[]): {
    byIt: (pattern?: RegExp) => {
        command: (runArgs?: {
            [k: string]: string;
        }, envVars?: {
            [k: string]: string;
        }) => {
            executor: (runnerOpts: IBuildOpts) => {
                execute: () => Promise<{
                    notRetriable: string[];
                    retriable: string[];
                }>;
            };
        };
    };
    byFile: () => {
        command: (runArgs?: {
            [k: string]: string;
        }, envVars?: {
            [k: string]: string;
        }) => {
            executor: (runnerOpts: IBuildOpts) => {
                execute: () => Promise<{
                    notRetriable: string[];
                    retriable: string[];
                }>;
            };
        };
    };
    asQueue: (patternOrQueue?: RegExp | string[], queue?: string[]) => {
        command: (runArgs?: {
            [k: string]: string;
        }, envVars?: {
            [k: string]: string;
        }) => {
            executor: (runnerOpts: IBuildOpts) => {
                execute: () => Promise<{
                    notRetriable: string[];
                    retriable: string[];
                }>;
            };
        };
    };
};
export { buildExecutor, mochaJasminePatternDoubleQuote, mochaJasminePatternSingleQuote };
