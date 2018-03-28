module.exports = async () => {
  // 某些初始化操作...
  if (Math.random() * 10 < 5) {
    // 50% 初始化异常并且throw
    throw new Error('init error');
  }
  return 'success';
}
