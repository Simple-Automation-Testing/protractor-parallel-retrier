# protractor-parallel-retrier

🛠 Development in progress, beta version

![npm downloads](https://img.shields.io/npm/dm/protractor-parallel-retrier.svg?style=flat-square)

## This library is a wrapper around ```process-rerun```

### The purpose of this library is - build simple and flexible interface for protractor framework parallel execution with rerun (on fail) possibility

### usage

```js
const {buildExecutor} = require('protractor-parallel-retrier');


executeAsQueue();
async function executeAsQueue() {

  const testCaseRegPattern = /(?<=it\(').+(?=')/ig;
  const cwd = process.cwd();

  const result = await buildExecutor(resolve(cwd, './protractor.conf.js'), resolve(cwd, './built/specs'))
    .asQueue(testCaseRegPattern, ['test case it name 1', 'test case it name 1'])
    .command({'--arg1': 'value_arg_1'}, {LOG_LEVEL: 'console'})
    .executor({attemptsCount: 5, maxThreads: 1, debugProcess: true, longestProcessTime: 60 * 1000, pollTime: 100})
    .execute();

  console.log(result);
  if(result.retriable.length || result.notRetriable.length) {
    process.exit(1);
  }
}


executeByFile();
async function executeByFile() {
  const cwd = process.cwd();
  const result = await buildExecutor(resolve(cwd, './protractor.conf.js'), resolve(cwd, './built/specs'))
    .byFile()
    .command({'--arg1': 'value_arg_1'}, {LOG_LEVEL: 'console'})
    .executor({attemptsCount: 2, maxThreads: 5, longestProcessTime: 60 * 1000, pollTime: 100})
    .execute();

  console.log(result);
  if(result.retriable.length || result.notRetriable.length) {
    process.exit(1);
  }
}


executeByIt();
async function executeByIt() {
  const cwd = process.cwd();
  const testCaseRegPattern = /(?<=it\(').+(?=')/ig;
  const result = await buildExecutor(resolve(cwd, './protractor.conf.js'), resolve(cwd, './built/specs'))
    .byIt(testCaseRegPattern)
    .command({'--arg1': 'value_arg_1'}, {LOG_LEVEL: 'console'})
    .executor({attemptsCount: 5, maxThreads: 2, debugProcess: true, longestProcessTime: 60 * 1000, pollTime: 100})
    .execute();

  console.log(result);
  if(result.retriable.length || result.notRetriable.length) {
    process.exit(1);
  }
}
```
