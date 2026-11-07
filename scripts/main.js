(() => {
  if (location.search.includes('debug')) document.body.classList.add('debug');

  const stage = document.getElementById('stage');
  const back = document.getElementById('back');

  // Вписываем рамку в окно с сохранением пропорций (размер берём из самой картинки)
  function fit() {
    const w = back.naturalWidth, h = back.naturalHeight;
    if (!w || !h) return;
    const k = Math.min((innerWidth * 0.96) / w, (innerHeight * 0.96) / h);
    stage.style.width = Math.round(w * k) + 'px';
    stage.style.height = Math.round(h * k) + 'px';
  }

  back.addEventListener('load', fit);
  window.addEventListener('resize', fit);
  if (back.complete) fit();
})();
