// Minimal VisuDSA-like starter (vanilla JS, no build step)
import { insertionSort } from './algorithms/insertionSort.js';
import { bubbleSort } from './algorithms/bubbleSort.js';
import { mergeSort } from './algorithms/mergeSort.js';
import { quickSort } from './algorithms/quickSort.js';
import { selectionSort } from './algorithms/selectionSort.js';
import { linearSearch } from './algorithms/linearSearch.js';
import { binarySearch } from './algorithms/binarySearch.js';

const sortingAlgorithms = {
  insertionSort,
  bubbleSort,
  mergeSort,
  quickSort,
  selectionSort
};

const searchingAlgorithms = {
  linearSearch,
  binarySearch
};

const formatName = (key) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());

const algoType = document.getElementById('algoType');
const algoSelect = document.getElementById('algoSelect');
const randomBtn = document.getElementById('randomBtn');
const loadBtn = document.getElementById('loadBtn');
const arrayInput = document.getElementById('arrayInput');
const searchTarget = document.getElementById('searchTarget');
const searchTargetLabel = document.getElementById('searchTargetLabel');

const firstBtn = document.getElementById('firstBtn');
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');
const lastBtn = document.getElementById('lastBtn');
const speedRange = document.getElementById('speedRange');
const stepCounter = document.getElementById('stepCounter');

const visual = document.getElementById('visual');
const searchVisual = document.getElementById('searchVisual');
const codePane = document.querySelector('#codePane code');
const complexityBody = document.getElementById('complexityBody');
const notesBody = document.getElementById('notesBody');

function populateAlgorithmSelect() {
  const currentType = algoType.value;
  const algorithms = currentType === 'sorting' ? sortingAlgorithms : searchingAlgorithms;
  
  algoSelect.innerHTML = '';
  Object.keys(algorithms).forEach((key, index) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = formatName(key);
    if (index === 0) {
      option.selected = true;
    }
    algoSelect.appendChild(option);
  });
  
  // Show/hide search target input
  const isSearching = currentType === 'searching';
  searchTarget.style.display = isSearching ? 'inline' : 'none';
  searchTargetLabel.style.display = isSearching ? 'inline' : 'none';
  visual.style.display = isSearching ? 'none' : 'block';
  searchVisual.style.display = isSearching ? 'block' : 'none';
}

let steps = [];
let run = null;
let idx = 0;
let playing = false;
let timer = null;

function parseArray(text) {
  return text
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n));
}

function randomArray(n = 8) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 99) + 1);
}

function renderBars(state) {
  if (!state) return;
  visual.innerHTML = '';
  const max = Math.max(...state.array, 1);
  state.array.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    if (state.sel?.includes(i)) bar.classList.add('sel');
    if (state.compare?.includes(i)) bar.classList.add('compare');
    if (state.swap?.includes(i)) bar.classList.add('swap');
    bar.style.height = `${20 + (v / max) * 200}px`;
    bar.title = String(v);
    const label = document.createElement('span');
    label.textContent = v;
    bar.appendChild(label);
    visual.appendChild(bar);
  });
  stepCounter.textContent = `Step ${idx + 1}/${steps.length}`;
}

function renderLinkedList(state) {
  if (!state) return;
  searchVisual.innerHTML = '';
  
  // Create linked list visualization
  const listContainer = document.createElement('div');
  listContainer.className = 'linked-list-container';
  
  // Add head pointer label
  const headLabel = document.createElement('div');
  headLabel.className = 'head-label';
  headLabel.textContent = 'head';
  listContainer.appendChild(headLabel);
  
  state.nodes.forEach((node, i) => {
    const nodeContainer = document.createElement('div');
    nodeContainer.className = 'node-container';
    
    const nodeEl = document.createElement('div');
    nodeEl.className = 'node';
    if (state.currentNode === i) nodeEl.classList.add('current');
    if (state.compareNode === i) nodeEl.classList.add('compare');
    if (state.found && state.currentNode === i) nodeEl.classList.add('found');
    
    const valueDiv = document.createElement('div');
    valueDiv.className = 'node-value';
    valueDiv.textContent = node.value;
    
    const pointerDiv = document.createElement('div');
    pointerDiv.className = 'node-pointer';
    pointerDiv.textContent = node.next !== null ? '•' : 'NULL';
    
    nodeEl.appendChild(valueDiv);
    nodeEl.appendChild(pointerDiv);
    nodeContainer.appendChild(nodeEl);
    
    // Add arrow if not last node
    if (node.next !== null) {
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      arrow.textContent = '→';
      nodeContainer.appendChild(arrow);
    }
    
    listContainer.appendChild(nodeContainer);
  });
  
  // Add target info
  const targetInfo = document.createElement('div');
  targetInfo.className = 'target-info';
  targetInfo.textContent = `Target: ${state.target}`;
  searchVisual.appendChild(targetInfo);
  
  searchVisual.appendChild(listContainer);
  stepCounter.textContent = `Step ${idx + 1}/${steps.length}`;
}

function renderBinarySearchArray(state) {
  if (!state) return;
  searchVisual.innerHTML = '';
  
  const arrayContainer = document.createElement('div');
  arrayContainer.className = 'binary-array-container';
  
  // Add target info
  const targetInfo = document.createElement('div');
  targetInfo.className = 'target-info';
  targetInfo.textContent = `Target: ${state.target}`;
  arrayContainer.appendChild(targetInfo);
  
  // Add array elements
  const elementsContainer = document.createElement('div');
  elementsContainer.className = 'array-elements';
  
  state.array.forEach((value, i) => {
    const element = document.createElement('div');
    element.className = 'array-element';
    element.textContent = value;
    
    if (i === state.left) element.classList.add('left-bound');
    if (i === state.right) element.classList.add('right-bound');
    if (i === state.mid) element.classList.add('mid');
    if (state.found && i === state.mid) element.classList.add('found');
    
    // Add index labels
    const indexLabel = document.createElement('div');
    indexLabel.className = 'index-label';
    indexLabel.textContent = i;
    element.appendChild(indexLabel);
    
    elementsContainer.appendChild(element);
  });
  
  arrayContainer.appendChild(elementsContainer);
  
  // Add pointer labels
  const pointersContainer = document.createElement('div');
  pointersContainer.className = 'pointers-container';
  
  state.array.forEach((_, i) => {
    const pointer = document.createElement('div');
    pointer.className = 'pointer-label';
    
    if (i === state.left) pointer.textContent = 'L';
    else if (i === state.right) pointer.textContent = 'R';
    else if (i === state.mid) pointer.textContent = 'M';
    
    pointersContainer.appendChild(pointer);
  });
  
  arrayContainer.appendChild(pointersContainer);
  searchVisual.appendChild(arrayContainer);
  stepCounter.textContent = `Step ${idx + 1}/${steps.length}`;
}

function renderCode(pseudo, hlLines = []) {
  codePane.innerHTML = '';
  pseudo.forEach((line, i) => {
    const div = document.createElement('span');
    div.className = 'line' + (hlLines.includes(i + 1) ? ' hl' : '');
    div.textContent = `${String(i + 1).padStart(2, ' ')}  ${line}`;
    codePane.appendChild(div);
  });
}

function renderComplexity(meta) {
  const rows = [
    ['Best', meta?.complexity?.best ?? '—'],
    ['Average', meta?.complexity?.avg ?? '—'],
    ['Worst', meta?.complexity?.worst ?? '—'],
    ['Space', meta?.space ?? 'O(1)']
  ];
  complexityBody.innerHTML = rows
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
    .join('');
  notesBody.innerHTML = meta?.notes ?? '';
}

function renderCurrentStep() {
  const currentType = algoType.value;
  if (currentType === 'sorting') {
    renderBars(steps[idx]);
  } else {
    const algoKey = algoSelect.value;
    if (algoKey === 'linearSearch') {
      renderLinkedList(steps[idx]);
    } else if (algoKey === 'binarySearch') {
      renderBinarySearchArray(steps[idx]);
    }
  }
  renderCode(run?.pseudocode ?? [], steps[idx]?.hlLines ?? []);
}

function buildSteps(algoKey, arr, target = null) {
  const currentType = algoType.value;
  const algorithms = currentType === 'sorting' ? sortingAlgorithms : searchingAlgorithms;
  const algo = algorithms[algoKey];
  if (!algo) return;
  
  run = currentType === 'searching' ? algo(arr, target) : algo(arr);
  steps = run.steps ?? [];
  if (!steps.length) {
    steps = [{ array: [...arr], hlLines: [] }];
  }
  idx = 0;
  renderCurrentStep();
  renderComplexity(run.meta ?? {});
}

function setStep(i) {
  if (!steps.length) return;
  idx = Math.max(0, Math.min(i, steps.length - 1));
  renderCurrentStep();
}

function stopPlaying() {
  playing = false;
  playBtn.textContent = '▶ Play';
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function playLoop() {
  if (!playing) return;
  if (idx < steps.length - 1) {
    setStep(idx + 1);
    timer = setTimeout(playLoop, Number(speedRange.value));
  } else {
    stopPlaying();
  }
}

// Event handlers
algoType.onchange = () => {
  populateAlgorithmSelect();
  const arr = parseArray(arrayInput.value);
  const target = parseInt(searchTarget.value);
  stopPlaying();
  buildSteps(algoSelect.value, arr, target);
};

algoSelect.onchange = () => {
  const arr = parseArray(arrayInput.value);
  const target = parseInt(searchTarget.value);
  stopPlaying();
  buildSteps(algoSelect.value, arr, target);
};

randomBtn.onclick = () => {
  const arr = randomArray(10);
  arrayInput.value = arr.join(', ');
  const target = parseInt(searchTarget.value) || arr[Math.floor(Math.random() * arr.length)];
  searchTarget.value = target;
  stopPlaying();
  buildSteps(algoSelect.value, arr, target);
};

loadBtn.onclick = () => {
  const arr = parseArray(arrayInput.value);
  if (arr.length === 0) {
    alert('Please enter numbers (comma-separated).');
    return;
  }
  const target = parseInt(searchTarget.value);
  stopPlaying();
  buildSteps(algoSelect.value, arr, target);
};

searchTarget.onchange = () => {
  const arr = parseArray(arrayInput.value);
  const target = parseInt(searchTarget.value);
  stopPlaying();
  buildSteps(algoSelect.value, arr, target);
};

firstBtn.onclick = () => {
  stopPlaying();
  setStep(0);
};
prevBtn.onclick = () => {
  stopPlaying();
  setStep(idx - 1);
};
nextBtn.onclick = () => {
  stopPlaying();
  setStep(idx + 1);
};
lastBtn.onclick = () => {
  stopPlaying();
  setStep(steps.length - 1);
};

playBtn.onclick = () => {
  if (!steps.length) return;
  playing = !playing;
  playBtn.textContent = playing ? '⏸ Pause' : '▶ Play';
  if (playing) {
    playLoop();
  } else {
    stopPlaying();
  }
};

// Boot
populateAlgorithmSelect();
const defaultAlgo = algoSelect.value || Object.keys(sortingAlgorithms)[0];
const initialArr = parseArray(arrayInput.value);
const initialTarget = parseInt(searchTarget.value);
buildSteps(defaultAlgo, initialArr, initialTarget);
