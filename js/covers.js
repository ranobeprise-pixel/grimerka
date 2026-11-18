// Конструктор обложек для рилс: 1080×1920, рамка сетки профиля 3:4 и безопасная зона.

const W = 1080, H = 1920;
const GRID = { x: 0, y: (H - 1440) / 2, w: 1080, h: 1440 }; // что видно в сетке профиля
const C = { night: '#17122B', blue: '#3D3BCB', fuchsia: '#E0368F', wine: '#6B1D2F', clay: '#FF6B3D', teal: '#63D2DF', paper: '#F4EEE3', ink: '#1A1320', yellow: '#F2D21B' };
const BGS = [['night', 'Ночь'], ['fuchsia', 'Фуксия'], ['wine', 'Бордо'], ['blue', 'Синий'], ['paper', 'Бумага']];
const STYLES = [['plate', 'Плашка'], ['meme', 'Мем'], ['hand', 'От руки']];

let s = { text: '', style: 'plate', bg: 'night', photo: null, stamp: true, cup: true, guides: true, pos: 'top' };
let cupImg = null;

function loadCup() {
  if (cupImg) return Promise.resolve(cupImg);
  return new Promise((res) => { const i = new Image(); i.onload = () => { cupImg = i; res(i); }; i.onerror = () => res(null); i.src = 'img/cup-sticker.png'; });
}

function wrap(ctx, text, maxW) {
  const words = text.split(/\s+/).filter(Boolean); const lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; } }
  if (cur) lines.push(cur); return lines;
}
function fit(ctx, text, font, maxW, maxH, start, lh) {
  for (let size = start; size >= 40; size -= 4) {
    ctx.font = font(size); const lines = wrap(ctx, text, maxW);
    const tooWide = lines.some((l) => ctx.measureText(l).width > maxW);
    if (!tooWide && lines.length * size * lh <= maxH) return { size, lines };
  }
  ctx.font = font(40); return { size: 40, lines: wrap(ctx, text, maxW) };
}
function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

async function draw(cv) {
  const ctx = cv.getContext('2d');
  await Promise.all(["900 80px Unbounded", "700 80px Unbounded", "700 80px Caveat", "400 30px 'Plex Mono'"].map((f) => document.fonts.load(f, 'Аа').catch(() => {})));
  // фон
  ctx.fillStyle = C[s.bg]; ctx.fillRect(0, 0, W, H);
  if (s.photo) {
    const r = Math.max(W / s.photo.width, H / s.photo.height); const pw = s.photo.width * r, ph = s.photo.height * r;
    ctx.drawImage(s.photo, (W - pw) / 2, (H - ph) / 2, pw, ph);
  } else {
    const g = ctx.createRadialGradient(200, 200, 0, 200, 200, 1100); g.addColorStop(0, 'rgba(224,54,143,.45)'); g.addColorStop(1, 'rgba(224,54,143,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const g2 = ctx.createRadialGradient(1000, 1300, 0, 1000, 1300, 1000); g2.addColorStop(0, 'rgba(61,59,203,.5)'); g2.addColorStop(1, 'rgba(61,59,203,0)');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);
  }
  // текст внутри рамки сетки, сверху или по центру
  const text = (s.text || 'Напиши хук').trim();
  const boxX = 110, boxW = W - 220;
  const y0 = s.pos === 'top' ? GRID.y + 90 : GRID.y + 420;
  const maxH = s.pos === 'top' ? 560 : 640;
  if (s.style === 'plate') {
    const t = text.toUpperCase();
    const { size, lines } = fit(ctx, t, (z) => `900 ${z}px Unbounded`, boxW - 100, maxH - 100, 112, 1.08);
    const h = lines.length * size * 1.08 + 90;
    ctx.fillStyle = 'rgba(0,0,0,.55)'; rrect(ctx, boxX + 14, y0 + 14, boxW, h, 34); ctx.fill();
    ctx.fillStyle = C.paper; ctx.strokeStyle = C.ink; ctx.lineWidth = 7; rrect(ctx, boxX, y0, boxW, h, 34); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = `900 ${size}px Unbounded`;
    lines.forEach((l, i) => ctx.fillText(l, W / 2, y0 + 48 + i * size * 1.08));
  } else if (s.style === 'meme') {
    const { size, lines } = fit(ctx, text, (z) => `700 ${z}px Unbounded`, boxW, maxH, 100, 1.15);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = `700 ${size}px Unbounded`; ctx.lineJoin = 'round';
    lines.forEach((l, i) => { const y = y0 + i * size * 1.15; ctx.strokeStyle = C.ink; ctx.lineWidth = size * 0.16; ctx.strokeText(l, W / 2, y); ctx.fillStyle = '#FFFFFF'; ctx.fillText(l, W / 2, y); });
  } else {
    const { size, lines } = fit(ctx, text, (z) => `700 ${z}px Caveat`, boxW, maxH, 150, 1.0);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.font = `700 ${size}px Caveat`; ctx.lineJoin = 'round';
    lines.forEach((l, i) => {
      const y = y0 + i * size; const w = ctx.measureText(l).width;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 14; ctx.strokeText(l, W / 2, y); ctx.fillStyle = C.teal; ctx.fillText(l, W / 2, y);
      if (i === lines.length - 1) { ctx.strokeStyle = C.fuchsia; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(W / 2 - w / 2, y + size * 0.95); ctx.quadraticCurveTo(W / 2, y + size * 1.08, W / 2 + w / 2, y + size * 0.92); ctx.stroke(); }
    });
  }
  // талисман и дата внизу рамки сетки
  if (s.cup) { const img = await loadCup(); if (img) { const w = 230, h = w * img.height / img.width; ctx.save(); ctx.translate(W - 290, GRID.y + GRID.h - h - 60); ctx.rotate(0.12); ctx.drawImage(img, 0, 0, w, h); ctx.restore(); } }
  if (s.stamp) {
    const d = new Date(); const z = (n) => String(n).padStart(2, '0'); const t = `${z(d.getDate())}/${z(d.getMonth() + 1)}/${d.getFullYear()}`;
    ctx.font = "400 46px 'Plex Mono'"; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillText(t, 112, GRID.y + GRID.h - 88); ctx.fillStyle = C.yellow; ctx.fillText(t, 108, GRID.y + GRID.h - 92);
  }
}

function guides(el) {
  el.innerHTML = s.guides ? `<div class="g-out top"></div><div class="g-out bot"></div><div class="g-grid"><span>видно в сетке профиля</span></div><div class="g-ui"></div>` : '';
}

export function viewCover(root, { cover, toast }) {
  if (cover) s.text = cover;
  const words = () => (s.text.trim() ? s.text.trim().split(/\s+/).length : 0);
  root.innerHTML = `<header class="top"><h1>Обложка</h1><p class="hand sub">один шаблон — и сетка выглядит как один блог</p></header>
  <div class="pad">
    <div class="cvwrap"><canvas id="c" width="${W}" height="${H}"></canvas><div class="guides" id="g"></div></div>
    <label class="fld"><span>Хук на обложке <em id="wc" class="mono"></em></span><textarea id="t" rows="2" placeholder="3–6 слов">${s.text.replace(/</g, '&lt;')}</textarea></label>
    <div class="filters" id="st">${STYLES.map(([k, t]) => `<button data-k="${k}" class="${s.style === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div class="filters" id="pos"><button data-k="top" class="${s.pos === 'top' ? 'on' : ''}">Текст сверху</button><button data-k="mid" class="${s.pos === 'mid' ? 'on' : ''}">По центру</button></div>
    <div class="bgs" id="bg">${BGS.map(([k, t]) => `<button data-k="${k}" title="${t}" class="${!s.photo && s.bg === k ? 'on' : ''}" style="background:${C[k]}"></button>`).join('')}<label class="btn ghost ph">Фото<input type="file" id="ph" accept="image/*" hidden></label></div>
    <div class="toggles">
      <label><input type="checkbox" id="o-cup" ${s.cup ? 'checked' : ''}> Талисман</label>
      <label><input type="checkbox" id="o-stamp" ${s.stamp ? 'checked' : ''}> Жёлтая дата</label>
      <label><input type="checkbox" id="o-g" ${s.guides ? 'checked' : ''}> Рамки</label>
    </div>
    <button class="btn" id="dl">Сохранить картинку</button>
    <p class="note">Розовая рамка — то, что видно в сетке профиля (3:4). Всё важное держи внутри неё. Нижнюю полосу закрывает интерфейс Instagram.</p>
  </div>`;
  const cv = root.querySelector('#c'); const g = root.querySelector('#g');
  let busy = false, again = false;
  const redraw = async () => { if (busy) { again = true; return; } busy = true; await draw(cv); busy = false; if (again) { again = false; redraw(); } };
  const wc = () => { const n = words(); const el = root.querySelector('#wc'); el.textContent = n ? `· ${n} сл.` : ''; el.style.color = n > 6 ? '#FF6B3D' : ''; };
  const t = root.querySelector('#t'); t.oninput = () => { s.text = t.value; wc(); redraw(); };
  const seg = (id, key) => root.querySelectorAll(`#${id} button`).forEach((b) => b.onclick = () => { s[key] = b.dataset.k; root.querySelectorAll(`#${id} button`).forEach((x) => x.classList.toggle('on', x === b)); redraw(); });
  seg('st', 'style'); seg('pos', 'pos');
  root.querySelectorAll('#bg button').forEach((b) => b.onclick = () => { s.bg = b.dataset.k; s.photo = null; root.querySelectorAll('#bg button').forEach((x) => x.classList.toggle('on', x === b)); redraw(); });
  root.querySelector('#ph').onchange = (e) => { const f = e.target.files[0]; if (!f) return; const i = new Image(); i.onload = () => { s.photo = i; root.querySelectorAll('#bg button').forEach((x) => x.classList.remove('on')); redraw(); }; i.src = URL.createObjectURL(f); };
  root.querySelector('#o-cup').onchange = (e) => { s.cup = e.target.checked; redraw(); };
  root.querySelector('#o-stamp').onchange = (e) => { s.stamp = e.target.checked; redraw(); };
  root.querySelector('#o-g').onchange = (e) => { s.guides = e.target.checked; guides(g); };
  root.querySelector('#dl').onclick = () => cv.toBlob(async (b) => {
    const f = new File([b], 'oblozhka.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f] }); return; } catch (e) { if (e.name === 'AbortError') return; } }
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'oblozhka.png'; a.click(); toast('Картинка сохранена');
  }, 'image/png');
  guides(g); wc(); redraw();
}
