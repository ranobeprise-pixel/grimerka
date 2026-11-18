import { PERSONA, PALETTE, FONTS, FRAME, WORKS, MODULES, SINS, TRICKS, SEED, STATUSES } from './data.js';

// ——— хранилище: всё только на этом устройстве ———
const KEY = 'grimerka.v1';
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.ideas) return s; } catch (e) {}
  const now = Date.now();
  return { ideas: SEED.map((x, i) => ({ ...x, created: now - i * 3600e3 })), tasks: {} };
}
let st = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

// ——— мелочи ———
const app = document.getElementById('app');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const paras = (t) => esc(t).split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
const stamp = (ms) => { const d = new Date(ms); const z = (n) => String(n).padStart(2, '0'); return `${z(d.getDate())}/${z(d.getMonth() + 1)}/${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`; };
const statusT = (k) => (STATUSES.find((s) => s.k === k) || STATUSES[0]).t;
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1800); }

export const MASK = (w = 120) => `<svg class="maskSvg" width="${w}" viewBox="0 0 120 150" aria-hidden="true">
  <path d="M10 70 L-2 64 M110 70 L122 64" stroke="#E0368F" stroke-width="3" stroke-linecap="round"/>
  <path d="M60 6C98 6 112 40 110 78C108 118 88 144 60 144C32 144 12 118 10 78C8 40 22 6 60 6Z" fill="#F7F1E6" stroke="#1A1320" stroke-width="3"/>
  <path d="M38 60q7-5 14 0M68 60q7-5 14 0" stroke="#1A1320" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="45" cy="71" r="3.6" fill="#1A1320"/><circle cx="75" cy="71" r="3.6" fill="#1A1320"/>
  <path d="M61 76L56 94L63 94" stroke="#1A1320" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="36" cy="98" r="10" fill="#E0368F" opacity=".45"/><circle cx="84" cy="98" r="10" fill="#E0368F" opacity=".45"/>
  <path d="M53 110Q60 105 67 110Q60 116 53 110Z" fill="#B8233F"/>
</svg>`;

const ICONS = {
  mask: '<svg viewBox="0 0 24 24"><path d="M12 2.5c5.2 0 7 4 6.7 8.6C18.4 16.6 15.6 21 12 21s-6.4-4.4-6.7-9.9C5 6.5 6.8 2.5 12 2.5Z"/><circle cx="9.2" cy="10.5" r=".9"/><circle cx="14.8" cy="10.5" r=".9"/><path d="M10.5 15.5q1.5 1 3 0"/></svg>',
  school: '<svg viewBox="0 0 24 24"><path d="M4 5.5C7 4.5 9.5 5 12 6.5c2.5-1.5 5-2 8-1v13c-3-1-5.5-.5-8 1-2.5-1.5-5-2-8-1Z"/><path d="M12 6.5v13"/></svg>',
  tricks: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.4 6.1 6.6.4-5.1 4.2 1.7 6.4L12 16l-5.6 3.6 1.7-6.4L3 9l6.6-.4Z"/></svg>',
  ideas: '<svg viewBox="0 0 24 24"><path d="M4 8.5h16v11H4z"/><path d="M4 8.5l2.5-4h11l2.5 4"/><path d="M9.5 12.5h5"/></svg>',
};
const TABS = [['mask', 'Маска'], ['school', 'Школа'], ['tricks', 'Приёмы'], ['ideas', 'Идеи']];

function shell(tab, inner, cls = '') {
  return `<div class="scr ${cls}">${inner}</div>
  <nav class="tabs">${TABS.map(([k, t]) => `<a href="#/${k}" class="${k === tab ? 'on' : ''}">${ICONS[k]}<span>${t}</span></a>`).join('')}</nav>`;
}
const top = (title, sub, back) => `<header class="top">${back ? `<a class="back" href="${back}">← назад</a>` : ''}<h1>${title}</h1>${sub ? `<p class="hand sub">${sub}</p>` : ''}</header>`;

// ——— Маска ———
function viewMask() {
  const p = PERSONA;
  const fold = (id, title, body, open) => `<details class="card fold" ${open ? 'open' : ''}><summary><span>${title}</span><i>+</i></summary><div class="fb">${body}</div></details>`;
  const html = `
  <section class="hero">
    <div class="spot"></div>
    ${MASK(112)}
    <h1 class="logo">Гримёрка</h1>
    <p class="hand">здесь надевают маску перед выходом в ленту</p>
  </section>
  <div class="pad">
    <div class="card quote"><span class="stamp">кто я в кадре</span><p class="big">${esc(p.line)}</p></div>
    <div class="traits">${p.traits.map((t, i) => `<div class="card trait t${i}"><b>${esc(t.t)}</b><p>${esc(t.d)}</p></div>`).join('')}</div>
    <div class="card phrase"><span class="hand">фирменное</span><p class="disp">${esc(p.phrases[0])}</p><ul class="chips">${p.phrases.slice(1).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    ${fold('against', 'Против чего я', `<ul class="ul">${p.against.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`)}
    ${fold('viewer', 'Мой зритель', `<p>${esc(p.viewer)}</p>`)}
    ${fold('effect', 'Эффект после ролика', `<p>${esc(p.effect)}</p>`)}
    ${fold('borders', 'Границы персонажа', `<ul class="ul">${p.borders.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`)}
    ${fold('rubrics', 'Рубрики', p.rubrics.map((r) => `<p><b>${esc(r.t)}.</b> ${esc(r.d)}</p>`).join(''))}
    ${fold('products', 'Что продаю', `<p>${esc(p.products)}</p>`)}

    <h2 class="sec">Визуальный код</h2>
    <p class="note">Нажми на цвет, чтобы скопировать код.</p>
    <div class="pal">${PALETTE.map((c) => `<button class="sw${c.on === '#F4EEE3' ? ' dk' : ''}" data-hex="${c.h}" style="background:${c.h};color:${c.on}"><b>${esc(c.n)}</b><span>${c.h}</span><em>${esc(c.s)}</em></button>`).join('')}</div>
    <div class="col">${FONTS.map((f) => `<div class="card font"><p class="${f.c}">${esc(f.s)}</p><small>${esc(f.f)} · ${esc(f.d)}</small></div>`).join('')}</div>
    ${fold('frame', 'Правила кадра', `<ol class="ul">${FRAME.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`, true)}

    <h2 class="sec">Мудборд из моих рук</h2>
    <div class="works">${WORKS.map((w, i) => `<figure class="w${i % 3}"><img src="${w.src}" alt="${esc(w.c)}" loading="lazy"><figcaption class="hand">${esc(w.c)}</figcaption></figure>`).join('')}</div>
    <p class="note center">Гримёрка хранит записи только на этом телефоне.</p>
  </div>`;
  app.innerHTML = shell('mask', html, 'maskscr');
  app.querySelectorAll('.sw').forEach((b) => b.onclick = () => { navigator.clipboard?.writeText(b.dataset.hex).then(() => toast(`${b.dataset.hex} скопирован`), () => toast(b.dataset.hex)); });
}

// ——— Школа ———
function doneCount(m) { return m.tasks.filter((_, i) => st.tasks[`${m.id}.${i}`]).length; }
function viewSchool() {
  const all = MODULES.reduce((a, m) => a + m.tasks.length, 0);
  const done = MODULES.reduce((a, m) => a + doneCount(m), 0);
  const html = `${top('Школа', 'восемь модулей, по одному в неделю')}
  <div class="pad">
    <div class="card prog"><div class="bar"><i style="width:${Math.round(done / all * 100)}%"></i></div><span class="mono">${done} из ${all} заданий</span></div>
    ${MODULES.map((m, i) => { const d = doneCount(m); const full = d === m.tasks.length; return `<a class="card mod ${full ? 'full' : ''}" href="#/school/${m.id}">
      <span class="num disp">${i + 1}</span><span class="grow"><b>${esc(m.t)}</b><small>${esc(m.s)}</small></span><span class="mono dots">${d}/${m.tasks.length}</span></a>`; }).join('')}
  </div>`;
  app.innerHTML = shell('school', html);
}
function viewModule(id) {
  const i = MODULES.findIndex((m) => m.id === id); const m = MODULES[i]; if (!m) return go('#/school');
  const html = `${top(`${i + 1}. ${esc(m.t)}`, esc(m.s), '#/school')}
  <div class="pad">
    <div class="card body">${m.body.map((b) => `<p>${esc(b)}</p>`).join('')}
    ${m.links.length ? `<p class="links">${m.links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">↗ ${esc(t)}</a>`).join('')}</p>` : ''}</div>
    <h2 class="sec">Задания</h2>
    ${m.tasks.map((t, k) => { const key = `${m.id}.${k}`; return `<label class="card task ${st.tasks[key] ? 'on' : ''}"><input type="checkbox" data-k="${key}" ${st.tasks[key] ? 'checked' : ''}><span class="box"></span><span>${esc(t)}</span></label>`; }).join('')}
    <div class="row">${i > 0 ? `<a class="btn ghost" href="#/school/${MODULES[i - 1].id}">← ${esc(MODULES[i - 1].t)}</a>` : ''}${i < MODULES.length - 1 ? `<a class="btn" href="#/school/${MODULES[i + 1].id}">${esc(MODULES[i + 1].t)} →</a>` : ''}</div>
  </div>`;
  app.innerHTML = shell('school', html);
  app.querySelectorAll('.task input').forEach((c) => c.onchange = () => { st.tasks[c.dataset.k] = c.checked; save(); c.closest('.task').classList.toggle('on', c.checked); if (c.checked) toast('Поебашили ✦'); });
}

// ——— Приёмы ———
let trickFilter = 'Хуки'; let trickQ = '';
function viewTricks() {
  const cats = ['Хуки', 'Структура', 'Сковородка', 'Подача', 'Визуал'];
  const q = trickQ.toLowerCase();
  const hit = (s) => !q || s.toLowerCase().includes(q);
  let list = '';
  if (trickFilter === 'Хуки') {
    list = SINS.filter((s) => hit(s.k + s.d + s.ex.join(' '))).map((s) => `<div class="card sin"><b class="disp">${esc(s.k)}</b><small>${esc(s.d)}</small>${s.ex.map((e) => `<p class="ex">«${esc(e)}»</p>`).join('')}</div>`).join('');
    list = `<div class="card rule"><p><b>Формула:</b> грех → бытовая ситуация → поворот, которого зритель не ждал.</p><p class="hand">грех вызывает узнавание, а не стыд</p></div>` + list;
  } else {
    list = TRICKS.filter((t) => t.cat === trickFilter && hit(t.t + t.d)).map((t) => `<div class="card trick"><b>${esc(t.t)}</b><p>${esc(t.d)}</p></div>`).join('');
  }
  const html = `${top('Приёмы', 'библиотека того, что работает')}
  <div class="pad">
    <button class="btn dice" id="dice">✦ Случайный хук на сегодня</button>
    <div id="diceOut"></div>
    <input class="search" id="q" placeholder="поиск по приёмам" value="${esc(trickQ)}">
    <div class="filters">${cats.map((c) => `<button class="${c === trickFilter ? 'on' : ''}" data-c="${c}">${c}</button>`).join('')}</div>
    ${list || '<p class="note center">Ничего не нашлось</p>'}
  </div>`;
  app.innerHTML = shell('tricks', html);
  app.querySelectorAll('.filters button').forEach((b) => b.onclick = () => { trickFilter = b.dataset.c; viewTricks(); });
  const qi = app.querySelector('#q'); qi.oninput = () => { trickQ = qi.value; clearTimeout(qi._t); qi._t = setTimeout(() => { viewTricks(); const n = app.querySelector('#q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); };
  app.querySelector('#dice').onclick = () => {
    const s = SINS[Math.floor(Math.random() * SINS.length)];
    const t = TRICKS.filter((x) => x.cat === 'Сковородка')[Math.floor(Math.random() * 4)];
    app.querySelector('#diceOut').innerHTML = `<div class="card diceCard"><span class="stamp">${stamp(Date.now())}</span><p>Грех: <b>${esc(s.k)}</b> — ${esc(s.d)}</p><p>Поворот: <b>${esc(t.t)}</b></p><p class="hand">Вспомни свою бытовую историю на эту тему и запиши искру во вкладку «Идеи».</p><a class="btn ghost" href="#/new?sin=${encodeURIComponent(s.k)}">+ Записать искру</a></div>`;
  };
}

// ——— Идеи ———
let ideaFilter = 'all';
function viewIdeas() {
  const counts = Object.fromEntries(STATUSES.map((s) => [s.k, st.ideas.filter((i) => i.status === s.k).length]));
  const list = st.ideas.filter((i) => ideaFilter === 'all' || i.status === ideaFilter).sort((a, b) => b.created - a.created);
  const html = `${top('Идеи', 'банк искр и сценариев')}
  <div class="pad">
    <a class="btn" href="#/new">+ Новая искра</a>
    <div class="filters"><button class="${ideaFilter === 'all' ? 'on' : ''}" data-f="all">Все ${st.ideas.length}</button>${STATUSES.map((s) => `<button class="${ideaFilter === s.k ? 'on' : ''}" data-f="${s.k}">${s.t} ${counts[s.k]}</button>`).join('')}</div>
    ${list.map((i) => `<a class="card idea st-${i.status}" href="#/idea/${i.id}"><span class="stamp">${stamp(i.created)}</span><b>${esc(i.title)}</b>${i.cover ? `<small class="hand">${esc(i.cover)}</small>` : ''}<span class="tags"><em class="s">${statusT(i.status)}</em>${i.sin ? `<em>${esc(i.sin)}</em>` : ''}</span></a>`).join('') || '<p class="note center">Пока пусто. Поебашили?</p>'}
    <details class="card fold"><summary><span>Резервная копия</span><i>+</i></summary><div class="fb">
      <p class="note">Записи живут только на этом телефоне. Сохраняй копию раз в месяц.</p>
      <div class="row"><button class="btn ghost" id="exp">Скачать копию</button><label class="btn ghost">Загрузить<input type="file" id="imp" accept="application/json" hidden></label></div>
    </div></details>
  </div>`;
  app.innerHTML = shell('ideas', html);
  app.querySelectorAll('.filters button').forEach((b) => b.onclick = () => { ideaFilter = b.dataset.f; viewIdeas(); });
  app.querySelector('#exp').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(st, null, 1)], { type: 'application/json' })); a.download = `grimerka-${new Date().toISOString().slice(0, 10)}.json`; a.click(); };
  app.querySelector('#imp').onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { const d = JSON.parse(t); if (!d.ideas) throw 0; st = d; save(); toast('Копия загружена'); viewIdeas(); }).catch(() => toast('Не тот файл')); };
}
function viewIdea(id) {
  const i = st.ideas.find((x) => x.id === id); if (!i) return go('#/ideas');
  const html = `${top(esc(i.title), i.cover ? esc(i.cover) : '', '#/ideas')}
  <div class="pad">
    <div class="filters st">${STATUSES.map((s) => `<button class="${i.status === s.k ? 'on' : ''}" data-s="${s.k}">${s.t}</button>`).join('')}</div>
    <div class="card script"><span class="stamp">${stamp(i.created)}${i.sin ? ` · ${esc(i.sin)}` : ''}</span>${i.text ? paras(i.text) : '<p class="note">Текста пока нет.</p>'}</div>
    <div class="row"><a class="btn ghost" href="#/edit/${i.id}">Редактировать</a><button class="btn ghost" id="copy">Скопировать текст</button></div>
    <button class="btn danger" id="del">Удалить</button>
  </div>`;
  app.innerHTML = shell('ideas', html);
  app.querySelectorAll('.st button').forEach((b) => b.onclick = () => { i.status = b.dataset.s; save(); viewIdea(id); });
  app.querySelector('#copy').onclick = () => navigator.clipboard?.writeText(`${i.cover ? i.cover + '\n\n' : ''}${i.text || ''}`).then(() => toast('Скопировано'));
  app.querySelector('#del').onclick = () => { if (confirmDel(i)) { st.ideas = st.ideas.filter((x) => x.id !== id); save(); go('#/ideas'); } };
}
function confirmDel(i) { const b = app.querySelector('#del'); if (b.dataset.sure) return true; b.dataset.sure = 1; b.textContent = 'Точно удалить? Нажми ещё раз'; return false; }
function viewEdit(id, preset = {}) {
  const i = id ? st.ideas.find((x) => x.id === id) : null;
  const v = i || { title: '', cover: '', text: '', sin: preset.sin || '', status: 'spark' };
  const html = `${top(i ? 'Правка' : 'Новая искра', 'записать, пока не убежало', i ? `#/idea/${i.id}` : '#/ideas')}
  <div class="pad">
    <label class="fld"><span>Тема</span><input id="f-title" value="${esc(v.title)}" placeholder="например: почему я в маске"></label>
    <label class="fld"><span>Хук для обложки</span><input id="f-cover" value="${esc(v.cover)}" placeholder="первая фраза ролика"></label>
    <label class="fld"><span>Грех</span><select id="f-sin"><option value="">—</option>${SINS.map((s) => `<option ${v.sin === s.k ? 'selected' : ''}>${s.k}</option>`).join('')}</select></label>
    <label class="fld"><span>Бытовой эпизод, мысль, сценарий</span><textarea id="f-text" rows="10" placeholder="что случилось · что я заметила · что мне помогает · вопрос">${esc(v.text)}</textarea></label>
    <div class="filters st">${STATUSES.map((s) => `<button class="${v.status === s.k ? 'on' : ''}" data-s="${s.k}">${s.t}</button>`).join('')}</div>
    <button class="btn" id="save">Сохранить</button>
  </div>`;
  app.innerHTML = shell('ideas', html);
  let status = v.status;
  app.querySelectorAll('.st button').forEach((b) => b.onclick = () => { status = b.dataset.s; app.querySelectorAll('.st button').forEach((x) => x.classList.toggle('on', x === b)); });
  app.querySelector('#save').onclick = () => {
    const val = (k) => app.querySelector(`#f-${k}`).value.trim();
    const title = val('title'); if (!title) { toast('Нужна тема'); return; }
    const data = { title, cover: val('cover'), sin: val('sin'), text: app.querySelector('#f-text').value.trim(), status };
    if (i) Object.assign(i, data); else st.ideas.push({ id: 'i' + Date.now().toString(36), created: Date.now(), ...data });
    save(); toast('Записано'); go(i ? `#/idea/${i.id}` : '#/ideas');
  };
}

// ——— маршруты ———
function go(h) { if (location.hash === h) route(); else location.hash = h; }
function route() {
  const h = location.hash.replace(/^#\/?/, '') || 'mask';
  const [path, qs] = h.split('?'); const [a, b] = path.split('/');
  const q = new URLSearchParams(qs || '');
  if (a === 'school') b ? viewModule(b) : viewSchool();
  else if (a === 'tricks') viewTricks();
  else if (a === 'ideas') viewIdeas();
  else if (a === 'idea') viewIdea(b);
  else if (a === 'new') viewEdit(null, { sin: q.get('sin') || '' });
  else if (a === 'edit') viewEdit(b);
  else viewMask();
  app.scrollTop = 0;
}
window.addEventListener('hashchange', route);
route();
