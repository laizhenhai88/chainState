const logger = require('laputa-log').createLogger();
const sleep = require('./lib/sleep');
const path = require('path');
const bb = require('./lib/bb');

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
  bb: bb,
  run: async ()=>{
    logger.info('running...');
    let chain = 'core', state = 'start', delay = 0, count = 0, pre = '';
    try {
      while(true) {
        // 延时
        await sleep(delay * 1000);

        // load state unit
        let stateUnit = require(path.join(process.cwd(), `./chain/${chain}`))[state];
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
        let result = '_error'
        try{
          result = await require(path.join(process.cwd(), `./state/${chain}/${state}`))();
        } catch(e) {
          logger.error(`${chain}:${state}`, {error:e})
          if (stateUnit[result]) {
            bb.set('_error', e)
          } else {
            throw e
          }
        }
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
      logger.error(`run error [${chain}:${state}]`, {error:e});
      throw e
    }
  }
}
