const bb = require('../../lib/bb');
const logger = require('../../lib/logger')();

module.exports = async (nm) => {
  // 某些初始化操作...
  logger.info(`start post task : ${JSON.stringify(bb.task)}`);
  return 'success';
}
