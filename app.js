// Minimal VisuAlgo-like starter (vanilla JS, no build step)
import { insertionSort } from './algorithms/insertionSort.js';

const algorithms = {
  insertionSort
};

const algoSelect = document.getElementById('algoSelect');
const randomBtn = document.getElementById('randomBtn');
const loadBtn = document.getElementById('loadBtn');
const arrayInput = document.getElementById('arrayInput');

const firstBtn = document.getElementById('firstBtn');
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');
const lastBtn = document.getElementById('lastBtn');
const speedRange = document.getElementById('speedRange');
const stepCounter = document.getElementById('stepCounter');

const visual = document.getElementById('visual');
const codePane = document.querySelector('#codePane code');
const complexityBody = document.getElementById('complexityBody');
const notesBody = document.getElementById('notesBody');

let steps = [];
let idx = 0;
let playing = false;
let timer = null;

function parseArray(text) {
  return text.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n));
}

function randomArray(n = 8) {
  return Array.from({length:n}, () => Math.floor(Math.random()*99)+1);
}

function renderBars(state) {
  visual.innerHTML = '';
  const max = Math.max(...state.array, 1);
  state.array.forEach((v,i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    if (state.sel?.includes(i)) bar.classList.add('sel');
    if (state.compare?.includes(i)) bar.classList.add('compare');
    if (state.swap?.includes(i)) bar.classList.add('swap');
    bar.style.height = (20 + (v/max)*200) + 'px';
    bar.title = String(v);
    const label = document.createElement('span');
    label.textContent = v;
    bar.appendChild(label);
    visual.appendChild(bar);
  });
  stepCounter.textContent = `Step ${idx+1}/${steps.length}`;
}

function renderCode(pseudo, hlLines=[]) {
  codePane.innerHTML = '';
  pseudo.forEach((line, i) => {
    const div = document.createElement('span');
    div.className = 'line' + (hlLines.includes(i+1) ? ' hl' : '');
    div.textContent = String(i+1).padStart(2,' ') + '  ' + line;
    codePane.appendChild(div);
  });
}

function renderComplexity(meta) {
  const rows = [
    ['Best', meta.complexity.best],
    ['Average', meta.complexity.avg],
    ['Worst', meta.complexity.worst],
    ['Space', meta.space || 'O(1)']
  ];
  complexityBody.innerHTML = rows.map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
  notesBody.innerHTML = meta.notes || '';
}

function buildSteps(algoKey, arr) {
  const algo = algorithms[algoKey];
  const result = algo(arr);
  steps = result.steps;
  idx = 0;
  renderBars(steps[idx]);
  renderCode(result.pseudocode, steps[idx].hlLines || []);
  renderComplexity(result.meta);
}

function setStep(i) {
  idx = Math.max(0, Math.min(i, steps.length-1));
  renderBars(steps[idx]);
  renderCode(currentAlgo().pseudocode, steps[idx].hlLines || []);
}

function currentAlgo() {
  return { pseudocode: algorithms[algoSelect.value](steps[0]?.array || []).pseudocode, meta: algorithms[algoSelect.value]([]).meta };
}

function playLoop() {
  if (!playing) return;
  if (idx < steps.length-1) {
    setStep(idx+1);
    timer = setTimeout(playLoop, Number(speedRange.value));
  } else {
    playing = false;
    playBtn.textContent = '▶ Play';
  }
}

// Event handlers
randomBtn.onclick = () => {
  const arr = randomArray(10);
  arrayInput.value = arr.join(', ');
  buildSteps(algoSelect.value, arr);
};

loadBtn.onclick = () => {
  const arr = parseArray(arrayInput.value);
  if (arr.length === 0) return alert('Please enter numbers (comma-separated).');
  buildSteps(algoSelect.value, arr);
};

firstBtn.onclick = () => setStep(0);
prevBtn.onclick = () => setStep(idx-1);
nextBtn.onclick = () => setStep(idx+1);
lastBtn.onclick = () => setStep(steps.length-1);

playBtn.onclick = () => {
  playing = !playing;
  playBtn.textContent = playing ? '⏸ Pause' : '▶ Play';
  if (playing) playLoop();
};

// Boot
buildSteps('insertionSort', parseArray(arrayInput.value));
