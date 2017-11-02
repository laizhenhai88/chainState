module.exports = async (nm) => {
  if (Math.random()*10 < 5) {
    // 50% 登录失败
    return 'failed';
  }

  return 'success';
}
