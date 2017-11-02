const runloop = require('./runloop');
const logger = require('./lib/logger')();

logger.info('init global instance');

let nm = {
  name : 'such as nightmare'
}

runloop.run(nm);
