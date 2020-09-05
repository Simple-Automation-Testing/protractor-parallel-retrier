# protractor-parallel-retrier

🛠 Development in progress, beta version

![npm downloads](https://img.shields.io/npm/dm/protractor-parallel-retrier.svg?style=flat-square)

## This library is a wrapper around ```process-rerun```

### The purpose of this library is - build simple and flexible interface for protractor framework parallel execution with rerun (on fail) possibility

### usage

```js
const {buildExecutor, mochaJasminePatternSingleQuote} = require('protractor-parallel-retrier');

executeParallel()
async function executeParallel() {
  const cwd = process.cwd();
  const result = await buildExecutor(
      resolve(cwd, './protractor.conf.js'),
      resolve(cwd, './specs'),
      {mocha: mochaJasminePatternSingleQuote}
    )
    .command(
      {'--mochaOpts.timeout': '100000', '--procTime': '1000', '--mochaOpts.reporter': 'mocha-allure2-reporter'},
      {'TESTS': 'test_example'}
    )
    .executor({attemptsCount: 2, maxThreads: 1, debugProcess: true})
    .execute();

  if(result.retriable.length) {
    // this is fail
    process.exit(1);
  }
}
```
