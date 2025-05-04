// 根据页面滚动更新进度条高度
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = (scrollTop / scrollHeight) * 100;
    document.getElementById('progressFill').style.height = percent + '%';
  });