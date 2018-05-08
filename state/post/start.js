const bb = require('../../lib/bb');
const logger = require('laputa-log').createLogger();

module.exports = async () => {
  // 某些初始化操作...
  logger.info(`start post task : ${JSON.stringify(bb.get('task'))}`);
  return 'success';
}
