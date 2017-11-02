module.exports = {
  start : {
    success: 'login:1'
  },
  login : {
    success: 'post:1',
    failed: 'logout4changeIp:1',
    _taskOut: [3, 'core:stop:1']
  },
  post : {
    success: 'logout:1',
    failed: 'post:1'
  },
  logout: {
    success: 'core:finish:1',
    failed: 'logout:1',
  },
  logout4changeIp: {
    _alias: 'logout',
    success: 'changeIp:1'
  },
  changeIp: {
    success: 'login:1',
    failed: 'changeIp:1'
  }
}
