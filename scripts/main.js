(() => {
  if (location.search.includes('debug')) document.body.classList.add('debug');

  const stage = document.getElementById('stage');
  const frame = document.getElementById('frame');

  // Вписываем рамку в окно с запасом по краям
  function fit() {
    const w = frame.naturalWidth, h = frame.naturalHeight;
    if (!w || !h) return;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const k = Math.min((vw * 0.94) / w, (vh * 0.94) / h);
    stage.style.width = Math.round(w * k) + 'px';
    stage.style.height = Math.round(h * k) + 'px';
  }

  frame.addEventListener('load', fit);
  window.addEventListener('resize', fit);
  window.addEventListener('load', fit);
  if (frame.complete) fit();
const hoverSound = new Audio('./media/audio/steam.ogg');
  hoverSound.preload = 'auto';
  hoverSound.volume = 0.4;           // громкость 0–1

  let unlocked = false;
  const unlock = () => { unlocked = true; };
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });

  document.querySelectorAll('.hit').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!unlocked) return;
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => {});
    });
  });
  
})();
