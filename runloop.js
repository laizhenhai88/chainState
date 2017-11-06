const logger = require('./lib/logger')();
const sleep = require('./lib/sleep');
const core = require('./chain/core');

const anaStateStr = (stateStr, currentChain) => {
  let chain,state,delay;
  chain = currentChain;
  delay = 0;
  let next = stateStr.split(':');
  // 校验next格式
  if (next.length == 1) {
    // state模式，chain还是用当前的
    state = next[0];
    delay = 0;
  } else if (next.length == 2) {
    if (/^[\d\.]+$/.test(next[1])) {
      // state:delay模式
      [state, delay] = next;
    } else {
      // chain:state模式
      [chain, state] = next;
      delay = 0;
    }
  } else if (next.length == 3) {
    // chain:state:delay模式
    [chain, state, delay] = next;
  }

  return [chain, state, delay];
}

let _taskOutRecord = {}

module.exports = {
  run: async (nm)=>{
    logger.info('run...');
    let chain = 'core', state = 'start', delay = 0, count = 0, pre = '';
    try {
      while(true) {
        // 延时
        await sleep(delay * 1000);

        // load state unit
        let stateUnit = require(`./chain/${chain}`)[state];
        // 判断状态是否超次数限制
        if (stateUnit._out && count >= stateUnit._out[0]) {
          [chain, state, delay] = anaStateStr(stateUnit._out[1], chain);
          logger.info(`  count out ${chain}:${state} ${count}`);
          continue;
        }

        // 判断状态是否超出总限制
        if (stateUnit._taskOut) {
          if (!_taskOutRecord[`${chain}:${state}`]) {
            _taskOutRecord[`${chain}:${state}`] = 1;
          } else {
            _taskOutRecord[`${chain}:${state}`] ++;
          }
          if (_taskOutRecord[`${chain}:${state}`] > stateUnit._taskOut[0]) {
            [chain, state, delay] = anaStateStr(stateUnit._taskOut[1], chain);
            logger.info(`   task out ${chain}:${state} ${count}`);
            delete _taskOutRecord[`${chain}:${state}`];
            continue;
          }
        }

        pre = `${chain}:${state}`;
        // every core:start will clean all task out
        if (pre == 'core:start') {
          _taskOutRecord = {};
        }
        logger.info(`enter state ${chain}:${state} ${count+1}`);
        // 有别名则替换
        if (stateUnit._alias) {
          alias = stateUnit._alias.split(':');
          if (alias.length == 1) {
            state = alias[0];
          } else if (alias.length == 2) {
            [chain, state] = alias;
          }
          logger.info(`      alias ${chain}:${state}`);
        }
        // 加载状态代码并执行
        let result = await require(`./state/${chain}/${state}`)(nm);
        // logger.info(`  out state ${chain}:${state} - ${result}`);
        if (stateUnit[result] == '') {
          break;
        }
        let next = anaStateStr(stateUnit[result], chain);
        if (pre == `${next[0]}:${next[1]}`) {
          count ++;
        } else {
          count = 0;
        }

        [chain, state, delay] = next;
      }
    } catch(e) {
      logger.error(`run error [${chain}:${state}]`, e);
      // TODO:上pm2的话，此处可以exit重新开始
    }
  }
}
