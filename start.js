const runloop = require('./runloop');
require('log4js').configure('./log4js.json')
runloop.run((e) => {
  process.exit(0)
});
