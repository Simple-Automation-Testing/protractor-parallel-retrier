const argv = require('minimist')(process.argv.slice(2));
const {TESTS} = process.env;

setTimeout(() => {
  console.log(argv);
  console.log(TESTS);
}, 2500)