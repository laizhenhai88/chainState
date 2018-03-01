module.exports = async () => {
  if (Math.random()*10 < 5) {
    // 50% 登录失败
    return 'failed';
  }

  return 'success';
}
