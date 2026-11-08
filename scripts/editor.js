(() => {
  const stage = document.getElementById('stage');
  document.body.classList.add('edit');

  const getN = (el, k, d = 0) => {
    const v = parseFloat(el.style.getPropertyValue(k));
    return isNaN(v) ? d : v;
  };
  const r2 = v => Math.round(v * 100) / 100;
  const setV = (el, k, v, unit = '') => {
    if (typeof v === 'string') {
      el.style.setProperty(k, v);
      return;
    }
    if (!Number.isFinite(v)) return;
    el.style.setProperty(k, r2(v) + unit);
  };

  stage.addEventListener('click', e => { if (e.target.closest('.hit')) e.preventDefault(); }, true);

  const css = document.createElement('style');
  css.textContent = `
  #ed{position:fixed;top:10px;right:10px;width:270px;max-height:calc(100vh - 20px);overflow-y:auto;z-index:99999;background:#111;color:#ddd;
    font:12px/1.4 Consolas,monospace;border:1px solid #444;padding:10px;user-select:none;cursor:default}
  #ed h4{margin:0 0 6px;font-size:12px;color:#0ff}
  #ed label{display:flex;align-items:center;gap:6px;margin:3px 0}
  #ed label span{width:52px;color:#999}
  #ed input[type=number],#ed input[type=text]{flex:1;min-width:0;background:#222;border:1px solid #444;color:#fff;padding:2px 4px}
  #ed input[type=range]{flex:2}
  #ed button{background:#222;color:#fff;border:1px solid #555;padding:4px 8px;margin:3px 3px 0 0;cursor:pointer}
  #ed button:hover{background:#333}
  #ed small{display:block;color:#777;margin-top:6px}
  #ed .row{display:none}
  #ed.hit-sel .for-hit,#ed.tip-sel .for-tip,#ed.img-sel .for-img{display:flex}
  #ed.img-sel .for-hit:not(.for-img){display:none !important}
  #edOut{position:fixed;left:10px;bottom:10px;right:290px;height:130px;z-index:99999;background:#000;color:#9f9;
    font:12px Consolas,monospace;border:1px solid #444;padding:6px;display:none;user-select:text}`;
  document.head.appendChild(css);

  const ed = document.createElement('div');
  ed.id = 'ed';
  ed.innerHTML = `
    <h4 id="edTitle">Ничего не выбрано</h4>
    <label class="row for-hit for-tip for-img"><span>X %</span><input type="number" step="0.1" data-k="--x"></label>
    <label class="row for-hit for-tip for-img"><span>Y %</span><input type="number" step="0.1" data-k="--y"></label>
    <label class="row for-hit for-img"><span>Ширина</span><input type="number" step="0.1" data-k="--w"></label>
    <label class="row for-hit for-img"><span>Высота</span><input type="number" step="0.1" data-k="--h"></label>
    <label class="row for-tip"><span>Угол</span><input type="range" min="-45" max="45" step="0.5" data-k="--rot"><input type="number" step="0.5" data-k="--rot" style="max-width:52px"></label>
    <label class="row for-tip"><span>Размер</span><input type="number" step="0.1" data-k="--fs"></label>
    <label class="row for-tip"><span>Текст</span><input type="text" id="edText"></label>
    <div>
      <button id="edAdd">+ кнопка и подпись</button>
      <button id="edDel">Удалить</button>
      <button id="edCopy">Копировать код</button>
    </div>
    <small>Тащи мышью. Стрелки: сдвиг 0.1% (с Shift 1%). Q / E: поворот подписи.</small>`;
  document.body.appendChild(ed);

  const out = document.createElement('textarea');
  out.id = 'edOut'; out.readOnly = true;
  document.body.appendChild(out);

  let sel = null;
  const inputs = [...ed.querySelectorAll('input[data-k]')];

  function sync() {
    if (!sel) return;
    const isImg = sel.id === 'kitty-gif';
    const isTip = sel.classList.contains('tip');
    
    ed.classList.toggle('tip-sel', isTip);
    ed.classList.toggle('hit-sel', !isTip && !isImg);
    ed.classList.toggle('img-sel', isImg);

    document.getElementById('edTitle').textContent = isImg ? 'Картинка/Гифка' : (isTip ? 'Подпись' : 'Кнопка');
    
    inputs.forEach(i => {
      const k = i.dataset.k;
      let val = sel.style.getPropertyValue(k);
      
      if (val === 'auto' || !val) {
          i.value = '';
      } else {
          i.value = r2(parseFloat(val));
      }
    });
    if (isTip) document.getElementById('edText').value = sel.textContent;
  }
  
  function select(el) {
    if (sel) sel.removeAttribute('data-sel');
    sel = el;
    if (sel) { sel.setAttribute('data-sel', ''); sync(); }
  }

  const unitOf = k => (k === '--rot' ? 'deg' : k === '--fs' ? 'vw' : '%');
  
  inputs.forEach(i => i.addEventListener('input', () => {
    if (!sel) return;
    const k = i.dataset.k;
    
    if (i.value === '') {
        if (k === '--w' || k === '--h') setV(sel, k, 'auto', '');
        return;
    }
    
    const v = parseFloat(i.value);
    if (isNaN(v)) return;
    
    let unit = unitOf(k);
    if (sel.id === 'kitty-gif' && (k === '--w' || k === '--h')) unit = '%';
    
    setV(sel, k, v, unit);
  }));
  
  document.getElementById('edText').addEventListener('input', e => {
    if (sel && sel.classList.contains('tip')) sel.textContent = e.target.value;
  });

  let drag = null;
  stage.addEventListener('pointerdown', e => {
    const el = e.target.closest('.hit, .tip, #kitty-gif');
    if (!el) return;
    e.preventDefault();
    select(el);
    const rect = stage.getBoundingClientRect();
    drag = { el, sx: e.clientX, sy: e.clientY, x0: getN(el, '--x'), y0: getN(el, '--y'), rect };
    el.setPointerCapture(e.pointerId);
  });
  
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = (e.clientX - drag.sx) / drag.rect.width * 100;
    const dy = (e.clientY - drag.sy) / drag.rect.height * 100;
    setV(drag.el, '--x', drag.x0 + dx, '%');
    setV(drag.el, '--y', drag.y0 + dy, '%');
    sync();
  });
  
  const endDrag = () => { drag = null; };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  window.addEventListener('keydown', e => {
    if (!sel || e.target.tagName === 'INPUT') return;
    const step = e.shiftKey ? 1 : 0.1;
    let used = true;
    if (e.key === 'ArrowLeft') setV(sel, '--x', getN(sel, '--x') - step, '%');
    else if (e.key === 'ArrowRight') setV(sel, '--x', getN(sel, '--x') + step, '%');
    else if (e.key === 'ArrowUp') setV(sel, '--y', getN(sel, '--y') - step, '%');
    else if (e.key === 'ArrowDown') setV(sel, '--y', getN(sel, '--y') + step, '%');
    else if (sel.classList.contains('tip') && (e.key === 'q' || e.key === 'Q' || e.key === 'й' || e.key === 'Й'))
      setV(sel, '--rot', getN(sel, '--rot') - (e.shiftKey ? 5 : 1), 'deg');
    else if (sel.classList.contains('tip') && (e.key === 'e' || e.key === 'E' || e.key === 'у' || e.key === 'У'))
      setV(sel, '--rot', getN(sel, '--rot') + (e.shiftKey ? 5 : 1), 'deg');
    else used = false;
    if (used) { e.preventDefault(); sync(); }
  });

  document.getElementById('edAdd').onclick = () => {
    const a = document.createElement('a');
    a.className = 'hit';
    a.setAttribute('style', '--x:45%; --y:45%; --w:6%; --h:8%;');
    a.href = '#';
    const p = document.createElement('p');
    p.className = 'tip';
    p.setAttribute('style', '--x:48%; --y:42%; --rot:-3deg; --fs:1.4vw;');
    p.textContent = 'Подпись';
    stage.append(a, p);
    select(a);
  };
  
  document.getElementById('edDel').onclick = () => {
    if (!sel) return;
    if (sel.classList.contains('hit')) {
      const next = sel.nextElementSibling;
      if (next && next.classList.contains('tip')) next.remove();
    }
    sel.remove(); select(null);
    document.getElementById('edTitle').textContent = 'Ничего не выбрано';
  };

  function serialize(el) {
    const c = el.cloneNode(false);
    c.removeAttribute('data-sel');
    
    const st = ['--x', '--y', '--w', '--h', '--rot', '--fs']
      .filter(k => el.style.getPropertyValue(k))
      .map(k => `${k}:${el.style.getPropertyValue(k).trim()};`).join(' ');
      
    if (el.id === 'kitty-gif') {
        return `<img id="kitty-gif" class="editable-img" src="${el.getAttribute('src')}" style="${st}" alt="" draggable="false" />`;
    }
      
    c.setAttribute('style', st);
    if (el.classList.contains('tip')) c.textContent = el.textContent;
    return c.outerHTML;
  }
  
  document.getElementById('edCopy').onclick = () => {
    const code = [...stage.querySelectorAll('.hit, .tip, #kitty-gif')].map(serialize).join('\n');
    out.value = code; out.style.display = 'block'; out.select();
    (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject())
      .catch(() => document.execCommand('copy'));
    document.getElementById('edCopy').textContent = 'Скопировано ✓';
    setTimeout(() => { document.getElementById('edCopy').textContent = 'Копировать код'; }, 1500);
  };
})();
