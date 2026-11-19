/* =============================================
   FOCUS DASHBOARD — app.js
   Vanilla JS, no frameworks
   ============================================= */

'use strict';

/* ─── LocalStorage Keys ─────────────────────── */
const KEYS = {
  THEME:  'fd_theme',
  NAME:   'fd_name',
  TODOS:  'fd_todos',
  LINKS:  'fd_links',
  TIMER:  'fd_timer_minutes',
};

/* ─── Utility helpers ───────────────────────── */
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function ls_get(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function ls_set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ─── Toast ─────────────────────────────────── */
const toastEl = (() => {
  const el = document.createElement('div');
  el.className = 'toast';
  document.body.appendChild(el);
  return el;
})();

let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}


/* =============================================
   1. THEME TOGGLE
   ============================================= */
const themeBtn = $('#themeToggle');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

(function initTheme() {
  applyTheme(ls_get(KEYS.THEME, 'light'));
})();

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  ls_set(KEYS.THEME, next);
  applyTheme(next);
});


/* =============================================
   2. GREETING — TIME, DATE & CUSTOM NAME
   ============================================= */
const timeEl      = $('#currentTime');
const dateEl      = $('#currentDate');
const greetingEl  = $('#greetingText');
const greetNameEl = $('#greetingName');
const nameInput   = $('#nameInput');
const saveNameBtn = $('#saveName');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function getGreeting(hour) {
  if (hour < 12) return 'Good Morning ☀️';
  if (hour < 17) return 'Good Afternoon 🌤';
  if (hour < 20) return 'Good Evening 🌆';
  return 'Good Night 🌙';
}

function updateClock() {
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2,'0');
  const mm  = String(now.getMinutes()).padStart(2,'0');
  const ss  = String(now.getSeconds()).padStart(2,'0');

  timeEl.textContent    = `${hh}:${mm}:${ss}`;
  dateEl.textContent    = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  greetingEl.textContent = getGreeting(now.getHours());
}

function renderGreetName() {
  const name = ls_get(KEYS.NAME, '');
  greetNameEl.textContent = name ? `Hello, ${name} 👋` : 'Hello, Friend 👋';
  nameInput.value = name || '';
}

saveNameBtn.addEventListener('click', () => {
  const val = nameInput.value.trim();
  ls_set(KEYS.NAME, val);
  renderGreetName();
  showToast(val ? `Name saved as "${val}"` : 'Name cleared');
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveNameBtn.click();
});

(function initGreeting() {
  renderGreetName();
  updateClock();
  setInterval(updateClock, 1000);
})();


/* =============================================
   3. POMODORO / FOCUS TIMER
   ============================================= */
const timerDisplay   = $('#timerDisplay');
const timerStartBtn  = $('#timerStart');
const timerStopBtn   = $('#timerStop');
const timerResetBtn  = $('#timerReset');
const customMinInput = $('#customMinutes');
const applyTimerBtn  = $('#applyTimer');

let timerDurationMinutes = ls_get(KEYS.TIMER, 25);
let timerTotalSeconds    = timerDurationMinutes * 60;
let timerRemaining       = timerTotalSeconds;
let timerInterval        = null;
let timerRunning         = false;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerRemaining);
  // Turn red when < 60 seconds and running
  if (timerRemaining <= 60 && timerRunning) {
    timerDisplay.classList.add('timer--urgent');
  } else {
    timerDisplay.classList.remove('timer--urgent');
  }
}

function tickTimer() {
  if (timerRemaining <= 0) {
    clearInterval(timerInterval);
    timerRunning = false;
    timerDisplay.classList.remove('timer--urgent');
    showToast('⏰ Time is up! Great focus session!');
    renderTimer();
    return;
  }
  timerRemaining--;
  renderTimer();
}

timerStartBtn.addEventListener('click', () => {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(tickTimer, 1000);
});

timerStopBtn.addEventListener('click', () => {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerDisplay.classList.remove('timer--urgent');
});

timerResetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning  = false;
  timerRemaining = timerTotalSeconds;
  timerDisplay.classList.remove('timer--urgent');
  renderTimer();
});

applyTimerBtn.addEventListener('click', () => {
  const val = parseInt(customMinInput.value, 10);
  if (!val || val < 1 || val > 120) {
    showToast('Please enter a value between 1 and 120');
    return;
  }
  clearInterval(timerInterval);
  timerRunning          = false;
  timerDurationMinutes  = val;
  timerTotalSeconds     = val * 60;
  timerRemaining        = timerTotalSeconds;
  ls_set(KEYS.TIMER, val);
  timerDisplay.classList.remove('timer--urgent');
  renderTimer();
  showToast(`Timer set to ${val} minutes`);
});

(function initTimer() {
  customMinInput.value = timerDurationMinutes;
  renderTimer();
})();


/* =============================================
   4. TO-DO LIST
   ============================================= */
const todoInput = $('#todoInput');
const addTodoBtn= $('#addTodo');
const todoList  = $('#todoList');
const sortSelect= $('#sortSelect');

let todos = ls_get(KEYS.TODOS, []);

function saveTodos() {
  ls_set(KEYS.TODOS, todos);
}

function getSortedTodos() {
  const sort = sortSelect.value;
  const copy = [...todos];
  if (sort === 'az')   copy.sort((a,b) => a.text.localeCompare(b.text));
  if (sort === 'za')   copy.sort((a,b) => b.text.localeCompare(a.text));
  if (sort === 'done') copy.sort((a,b) => Number(a.done) - Number(b.done));
  return copy;
}

function renderTodos() {
  todoList.innerHTML = '';
  const sorted = getSortedTodos();

  if (sorted.length === 0) {
    todoList.innerHTML = '<li class="todo__empty">No tasks yet. Add one above! 🎉</li>';
    return;
  }

  sorted.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo__item${todo.done ? ' is-done' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <input type="checkbox" class="todo__checkbox" ${todo.done ? 'checked' : ''} aria-label="Mark done" />
      <span class="todo__text">${escapeHtml(todo.text)}</span>
      <div class="todo__actions">
        <button class="todo__btn todo__btn--edit"   title="Edit task">✏️</button>
        <button class="todo__btn todo__btn--delete" title="Delete task">🗑️</button>
      </div>
    `;

    // Checkbox toggle
    li.querySelector('.todo__checkbox').addEventListener('change', () => toggleTodo(todo.id));

    // Edit button
    li.querySelector('.todo__btn--edit').addEventListener('click', () => startEdit(todo.id, li));

    // Delete button
    li.querySelector('.todo__btn--delete').addEventListener('click', () => deleteTodo(todo.id));

    todoList.appendChild(li);
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) { showToast('Please enter a task'); return; }

  // Prevent duplicate tasks (case-insensitive)
  const duplicate = todos.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) { showToast('Task already exists!'); return; }

  todos.push({ id: Date.now(), text, done: false });
  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) { todo.done = !todo.done; saveTodos(); renderTodos(); }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
  showToast('Task deleted');
}

function startEdit(id, li) {
  const todo    = todos.find(t => t.id === id);
  if (!todo) return;
  const textSpan = li.querySelector('.todo__text');
  const actions  = li.querySelector('.todo__actions');

  // Replace text with input
  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'todo__edit-input';
  editInput.value     = todo.text;
  editInput.maxLength = 100;
  textSpan.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  // Replace buttons with save/cancel
  actions.innerHTML = `
    <button class="todo__btn todo__btn--save"   title="Save">✅</button>
    <button class="todo__btn todo__btn--cancel" title="Cancel">✖️</button>
  `;

  const saveEdit = () => {
    const newText = editInput.value.trim();
    if (!newText) { showToast('Task cannot be empty'); return; }

    // Check duplicate (excluding current task)
    const duplicate = todos.some(t => t.id !== id && t.text.toLowerCase() === newText.toLowerCase());
    if (duplicate) { showToast('Task already exists!'); return; }

    todo.text = newText;
    saveTodos();
    renderTodos();
  };

  const cancelEdit = () => renderTodos();

  actions.querySelector('.todo__btn--save').addEventListener('click', saveEdit);
  actions.querySelector('.todo__btn--cancel').addEventListener('click', cancelEdit);
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  saveEdit();
    if (e.key === 'Escape') cancelEdit();
  });
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTodo(); });
sortSelect.addEventListener('change', renderTodos);

(function initTodos() {
  renderTodos();
})();


/* =============================================
   5. QUICK LINKS
   ============================================= */
const linkLabelInput = $('#linkLabel');
const linkUrlInput   = $('#linkUrl');
const addLinkBtn     = $('#addLink');
const linksListEl    = $('#linksList');

let links = ls_get(KEYS.LINKS, []);

function saveLinks() {
  ls_set(KEYS.LINKS, links);
}

function getFavicon(url) {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?sz=16&domain_url=${origin}`;
  } catch { return ''; }
}

function renderLinks() {
  linksListEl.innerHTML = '';

  if (links.length === 0) {
    linksListEl.innerHTML = '<span class="links__empty">No links yet. Add your favorites above!</span>';
    return;
  }

  links.forEach((link) => {
    const item = document.createElement('div');
    item.className = 'link__item';

    const favicon = getFavicon(link.url);
    item.innerHTML = `
      ${favicon ? `<img src="${favicon}" alt="" width="16" height="16" onerror="this.style.display='none'" />` : ''}
      <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link__anchor" title="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>
      <button class="link__delete" data-id="${link.id}" title="Remove link">✕</button>
    `;

    item.querySelector('.link__delete').addEventListener('click', () => deleteLink(link.id));
    linksListEl.appendChild(item);
  });
}

function addLink() {
  const label = linkLabelInput.value.trim();
  const url   = linkUrlInput.value.trim();

  if (!label) { showToast('Please enter a label'); return; }
  if (!url)   { showToast('Please enter a URL');   return; }

  // Basic URL validation
  try { new URL(url); } catch {
    showToast('Please enter a valid URL (include https://)');
    return;
  }

  links.push({ id: Date.now(), label, url });
  saveLinks();
  renderLinks();
  linkLabelInput.value = '';
  linkUrlInput.value   = '';
  linkLabelInput.focus();
  showToast(`"${label}" added`);
}

function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
  showToast('Link removed');
}

addLinkBtn.addEventListener('click', addLink);
linkUrlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addLink(); });

(function initLinks() {
  renderLinks();
})();
