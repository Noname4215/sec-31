(() => {
  const stage = document.getElementById('stage');
  const frame = document.getElementById('frame');

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

  const hoverSound = new Audio('./media/audio/hover.mp3');
  hoverSound.preload = 'auto';
  hoverSound.volume = 0.4;
  let unlocked = false;
  const unlock = () => { unlocked = true; };
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
  stage.addEventListener('mouseover', e => {
    if (!unlocked || location.search.includes('edit')) return;
    if (e.target.classList && e.target.classList.contains('hit')) {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => {});
    }
  });

  if (location.search.includes('edit')) {
    const s = document.createElement('script');
    s.src = './scripts/editor.js?v=1';
    document.body.appendChild(s);
  }
})();
