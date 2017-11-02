// bb是全局缓存，可以保存执行中的数据，例如task信息
const bb = require('../../lib/bb');

module.exports = async (nm) => {
  // 获取任务
  if (Math.random()*10 < 7) {
    // 70% 获取失败
    return 'failed';
  }

  // 获取成功
  bb.task = {
    name: 'xxx',
    type: 'post'
  }
  // 任务类型是发帖
  return 'post';
}
