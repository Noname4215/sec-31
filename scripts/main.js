// Функция инициализации дебага
function initDebug() {
  console.log("=== DEBUG MOD СТАРТОВАЛ ===");
  
  // 1. Принудительно вешаем класс debug на тег HTML
  document.documentElement.classList.add('debug');
  console.log("Класс .debug добавлен на <html>");

  // 2. Ищем панель
  const panel = document.querySelector('.panel');
  if (!panel) {
    console.error("ОШИБКА: Элемент с классом .panel не найден в HTML!");
    return;
  }

  // 3. Делаем панель и её родителей кликабельными, чтобы стили не мешали
  panel.style.pointerEvents = 'auto';
  panel.style.zIndex = '9999'; // Поднимаем на самый верх над всеми шумами
  
  const stage = document.querySelector('.stage');
  if (stage) stage.style.pointerEvents = 'auto';

  console.log("Панель найдена и подготовлена к кликам. Кликните по ней!");

  // 4. Вешаем событие клика
  panel.addEventListener('click', function(e) {
    // Если кликнули на уже созданную кнопку — игнорируем
    if (e.target.classList.contains('hit')) return;

    const rect = panel.getBoundingClientRect();
    
    // Считаем координаты в % от панели
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';

    // Создаем хитбокс
    const debugHit = document.createElement('div');
    debugHit.className = 'hit';
    
    // Записываем инлайн-стили, чтобы они СРАЗУ сработали без CSS-переменных
    debugHit.style.position = 'absolute';
    debugHit.style.left = x;
    debugHit.style.top = y;
    debugHit.style.width = '50px';  // Временная фиксированная ширина для теста
    debugHit.style.height = '50px'; // Временная фиксированная высота для теста
    debugHit.style.outline = '2px dashed #00ff00'; // Яркая зеленая рамка
    debugHit.style.background = 'rgba(0, 255, 0, 0.2)';
    debugHit.style.zIndex = '10000';

    panel.appendChild(debugHit);

    console.log(`%c Создана зона! CSS: left: ${x}; top: ${y};`, 'color: #00ff00; font-weight: bold;');
  });
}

// Проверяем URL и запускаем
if (window.location.search.includes('debug')) {
  // Запускаем только после полной загрузки страницы, чтобы элементы успели создаться
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDebug);
  } else {
    initDebug();
  }
}
