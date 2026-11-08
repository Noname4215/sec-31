(() => {
  const stage = document.getElementById('stage');
  const frame = document.getElementById('frame');
  const isEdit = location.search.includes('edit');

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

  // ---------- звуки ----------
  const sounds = {};
  function getSound(src, vol = 0.4) {
    if (!sounds[src]) {
      const a = new Audio(src);
      a.preload = 'auto';
      a.volume = vol;
      sounds[src] = a;
    }
    return sounds[src];
  }
  function play(src, vol) {
    const a = getSound(src, vol);
    a.currentTime = 0;
    a.play().catch(() => {});
  }

  // звук при наведении: только у кнопок с атрибутом data-hover="путь/к/звуку"
  let unlocked = false;
  const unlock = () => { unlocked = true; };
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
  stage.addEventListener('mouseover', e => {
    if (!unlocked || isEdit) return;
    const hit = e.target.closest && e.target.closest('.hit[data-hover]');
    if (hit) play(hit.dataset.hover, 0.4);
  });

  // ---------- экран: клик по кнопке включает / выключает ----------
  const display = document.getElementById('display');
  const displayBtn = document.getElementById('display-btn');
  if (display && displayBtn) {
    displayBtn.addEventListener('click', e => {
      e.preventDefault();
      if (isEdit) return;
      display.classList.toggle('on');
    });
  }

  // ---------- кот: по клику мяу, с малым шансом другой звук ----------
  const RARE_CHANCE = 0.08; // 8%
  const kittyBtn = document.getElementById('kitty-btn');
  if (kittyBtn) {
    kittyBtn.addEventListener('click', e => {
      e.preventDefault();
      if (isEdit) return;
      const src = Math.random() < RARE_CHANCE
        ? './media/audio/gofuckyourself.ogg'
        : './media/audio/meow.ogg';
      play(src, 0.7);
    });
  }

  if (isEdit) {
    const s = document.createElement('script');
    s.src = './scripts/editor.js?v=4';
    document.body.appendChild(s);
  }
})();
