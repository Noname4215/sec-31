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


// Запускаем инструмент разработчика только в режиме ?debug
if (window.location.search.includes('debug')) {
  const panel = document.querySelector('.panel');
  
  if (panel) {
    panel.style.pointerEvents = 'auto'; // чтобы панель ловила клики
    
    panel.addEventListener('click', (e) => {
      // Игнорируем клики, если кликнули по уже созданной хит-зоне
      if (e.target.classList.contains('hit')) return;
      
      const rect = panel.getBoundingClientRect();
      // Считаем координаты клика в процентах от родительской панели
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
      
      // Создаем тестовый хитбокс
      const debugHit = document.createElement('div');
      debugHit.className = 'hit';
      debugHit.style.setProperty('--x', x);
      debugHit.style.setProperty('--y', y);
      debugHit.style.setProperty('--w', '10%'); // дефолтная ширина
      debugHit.style.setProperty('--h', '10%'); // дефолтная высота
      debugHit.style.pointerEvents = 'auto';
      
      panel.appendChild(debugHit);
      
      // Выводим готовые переменные для вставки в CSS или массив объектов в JS
      console.log(`Новая зона: --x: ${x}; --y: ${y}; --w: 10%; --h: 10%;`);
    });
  }
}
