module.exports = {
  start : {
    success: 'getTask:1'
  },
  getTask : {
    post: 'post:start:1',
    failed: 'getTask:1',
    _out: [3, 'stop:1']
  },
  finish : {
    success: 'start:1',
    failed: 'finish:1'
  },
  failed: {
    success: 'start:1',
    failed: 'failed:1'
  },
  stop: {
    success: ''
  }
}
