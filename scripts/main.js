(() => {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // ?debug показывает контуры кнопок и панели
  if (location.search.includes('debug')) document.body.classList.add('debug');

  // Если рамки ещё нет в media/assets — показываем заглушку
  const frame = document.getElementById('frameImg');
  const checkFrame = () => { if (!frame.complete || !frame.naturalWidth) document.body.classList.add('no-frame'); };
  frame.addEventListener('error', () => document.body.classList.add('no-frame'));
  if (frame.complete) checkFrame();

  // ---- Курсор ----
  const cursor = document.getElementById('cursor');
  if (!isTouch) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a').forEach(a => {
      a.addEventListener('mouseenter', () => cursor.classList.add('active'));
      a.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // ---- Цитаты ----
  const quotes = [
    'Чоң дик жана тердеген топтор',
    'не бойся',
    'dream residue',
    'Рисовий пиріг',
    'Міньйон листя',
    'measure 19',
    'Полиция меня ищет',
    'Толстые яйца'
  ];
  const quoteEl = document.getElementById('quote');
  const setQuote = () => { quoteEl.innerText = quotes[Math.floor(Math.random() * quotes.length)]; };
  setQuote();
  setInterval(() => {
    quoteEl.style.opacity = '0';
    setTimeout(() => { setQuote(); quoteEl.style.opacity = '0.14'; }, 700);
  }, 14000);

  // ---- Заголовок вкладки ----
  const tabTitles = ['КТО ТУТ?', 'Яйца', 'Хомяк-пенис', 'Хуяка', 'sun', '0.1.9'];
  let ti = 0;
  setInterval(() => { document.title = tabTitles[ti]; ti = (ti + 1) % tabTitles.length; }, 1200);

  // ---- Частицы ----
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 48, density: { enable: true, value_area: 900 } },
        color: { value: ['#d9d9d9', '#bdbdc7', '#ffffff'] },
        shape: { type: 'circle' },
        opacity: { value: 0.18, random: true, anim: { enable: true, speed: 0.25, opacity_min: 0.05, sync: false } },
        size: { value: 2.2, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.55, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      retina_detect: true
    });
  }

  // ---- Лёгкое смещение панели за мышью ----
  const box = document.getElementById('floatBox');
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX - innerWidth / 2) / innerWidth;
    my = (e.clientY - innerHeight / 2) / innerHeight;
    if (!isTouch) box.style.transform = `translate3d(${mx * 22}px, ${my * 16}px, 0)`;
  });

  // ---- ASCII-заголовок ----
  const asciiTitle = document.getElementById('ascii-title');
  const chars = ' .,:;irsXA253hMHGS#9B&@';
  const cv = document.createElement('canvas');
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const TEXT = 'YAITSA';
  let t = 0;

  function renderAscii() {
    const mobile = innerWidth < 768;
    const W = mobile ? 260 : 420, H = mobile ? 90 : 140;
    cv.width = W; cv.height = H;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);

    const dx = Math.sin(t) * 1.2 + mx * 5;
    const dy = Math.cos(t * 0.8) * 1.1 + my * 3;
    ctx.save();
    ctx.translate(W / 2 + dx, H / 2 + dy);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `bold ${mobile ? 58 : 92}px monospace`;
    ctx.globalAlpha = 1;                       ctx.fillStyle = '#fff';    ctx.fillText(TEXT, 0, 0);
    ctx.globalAlpha = .14 + Math.sin(t * 1.7) * .02; ctx.fillStyle = '#cfd8ff'; ctx.fillText(TEXT, -4, 0);
    ctx.globalAlpha = .08 + Math.cos(t * 1.3) * .015; ctx.fillStyle = '#ffdede'; ctx.fillText(TEXT, 4, 0);
    ctx.restore();

    const d = ctx.getImageData(0, 0, W, H).data;
    const step = mobile ? 5 : 6;
    let out = '';
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4;
        const b = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
        const n = (Math.sin(t * 1.8 + x * .04 + y * .03) + 1) * .02;
        out += chars[Math.floor(Math.max(0, Math.min(1, b + n)) * (chars.length - 1))];
      }
      out += '\n';
    }
    asciiTitle.textContent = out;
    t += .03;
    requestAnimationFrame(renderAscii);
  }
  renderAscii();
})();
