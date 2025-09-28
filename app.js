// Minimal VisuDSA-like starter (vanilla JS, no build step)
import { insertionSort } from './algorithms/insertionSort.js';
import { bubbleSort } from './algorithms/bubbleSort.js';
import { mergeSort } from './algorithms/mergeSort.js';
import { quickSort } from './algorithms/quickSort.js';
import { selectionSort } from './algorithms/selectionSort.js';
import { linearSearch } from './algorithms/linearSearch.js';
import { binarySearch } from './algorithms/binarySearch.js';
import { createBST } from './algorithms/bst.js';

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

// Trees (BST)
let bstSession = null; // holds {steps, state, api}

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
// BST controls
const bstValue = document.getElementById('bstValue');
const bstValueLabel = document.getElementById('bstValueLabel');
const bstInsertBtn = document.getElementById('bstInsertBtn');
const bstSearchBtn = document.getElementById('bstSearchBtn');
const bstClearBtn = document.getElementById('bstClearBtn');

const firstBtn = document.getElementById('firstBtn');
const prevBtn = document.getElementById('prevBtn');
const playBtn = document.getElementById('playBtn');
const nextBtn = document.getElementById('nextBtn');
const lastBtn = document.getElementById('lastBtn');
const speedRange = document.getElementById('speedRange');
const stepCounter = document.getElementById('stepCounter');

const visual = document.getElementById('visual');
const searchVisual = document.getElementById('searchVisual');
const treeVisual = document.getElementById('treeVisual');
const codePane = document.querySelector('#codePane code');
const complexityBody = document.getElementById('complexityBody');
const notesBody = document.getElementById('notesBody');

function populateAlgorithmSelect() {
  const currentType = algoType.value;
  const algorithms = currentType === 'sorting' ? sortingAlgorithms : (currentType === 'searching' ? searchingAlgorithms : {});
  
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
  const isTrees = currentType === 'trees';
  searchTarget.style.display = isSearching ? 'inline' : 'none';
  searchTargetLabel.style.display = isSearching ? 'inline' : 'none';
  visual.style.display = isSearching || isTrees ? 'none' : 'block';
  searchVisual.style.display = isSearching ? 'block' : 'none';
  treeVisual.style.display = isTrees ? 'block' : 'none';

  // toggle BST controls
  const bstControls = [bstValueLabel, bstValue, bstInsertBtn, bstSearchBtn, bstClearBtn];
  bstControls.forEach(el => el.style.display = isTrees ? (el.tagName === 'INPUT' || el.tagName === 'LABEL' ? 'inline' : 'inline-block') : 'none');

  // Toggle array controls for Trees mode
  const arrayControls = [algoSelect, randomBtn, arrayInput, loadBtn];
  arrayControls.forEach(el => el.style.display = isTrees ? 'none' : (el === algoSelect ? 'inline-block' : 'inline'));

  if (isTrees) {
    ensureBSTInitialized();
    renderBSTStep();
    renderComplexity({ complexity: { best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)' }, space: 'O(h)' });
    renderCode(bstSession?.pseudocode ?? [], []);
  }
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

// --- BST layout helpers ---
function computePositions(root, width, levelHeight) {
  // Subtree-width-based tidy layout
  // Returns array of {id, key, x, y}
  const res = [];
  if (!root) return res;

  const MIN_GAP = 56; // minimum horizontal spacing between sibling subtrees
  const PADDING = 20; // left/right padding in px

  const widths = new Map(); // nodeId -> subtree width in layout units

  function measure(node) {
    if (!node) return 0;
    const wl = measure(node.left);
    const wr = measure(node.right);
    // If leaf, width = MIN_GAP; else sum of children widths, but at least MIN_GAP
    const w = Math.max(MIN_GAP, (wl || 0) + (wr || 0));
    widths.set(node.id, w);
    return w;
  }

  const totalUnits = measure(root) || MIN_GAP;
  const usableWidth = Math.max(2 * PADDING + MIN_GAP, width - 2 * PADDING);
  const scale = usableWidth / totalUnits;

  function layout(node, xStartUnits, depth) {
    if (!node) return;
    const wl = node.left ? (widths.get(node.left.id) || MIN_GAP) : 0;
    // Position this node centered over the split between left and right
    const xUnits = xStartUnits + wl;
    const x = PADDING + xUnits * scale;
    const y = (depth + 1) * levelHeight;
    res.push({ id: node.id, key: node.key, x, y });
    // Lay out left subtree within [xStartUnits, xStartUnits + wl)
    layout(node.left, xStartUnits, depth + 1);
    // Right subtree starts at xStartUnits + wl
    layout(node.right, xStartUnits + wl, depth + 1);
  }

  layout(root, 0, 0);
  return res;
}

function edgesFrom(root) {
  const edges = [];
  function dfs(node){
    if (!node) return;
    if (node.left) edges.push([node.id, node.left.id]);
    if (node.right) edges.push([node.id, node.right.id]);
    dfs(node.left); dfs(node.right);
  }
  dfs(root);
  return edges;
}

function renderBSTStep() {
  treeVisual.innerHTML = '';
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('edges-layer');
  treeVisual.appendChild(svg);
  const nodesLayer = document.createElement('div');
  nodesLayer.className = 'bst-nodes-layer';
  treeVisual.appendChild(nodesLayer);
  const w = treeVisual.clientWidth || 700;
  const h = treeVisual.clientHeight || 400;
  const levelH = Math.max(70, h / 6);
  const nodes = computePositions(bstSession.state.root, w, levelH);
  const idToPos = new Map(nodes.map(n => [n.id, n]));

  // level guide lines
  const depthMax = Math.max(1, Math.ceil((h - 40) / levelH));
  for (let d = 1; d <= Math.min(6, depthMax); d++) {
    const y = d * levelH;
    const lvl = document.createElementNS('http://www.w3.org/2000/svg','line');
    lvl.setAttribute('x1', '0');
    lvl.setAttribute('x2', String(w));
    lvl.setAttribute('y1', String(y));
    lvl.setAttribute('y2', String(y));
    lvl.setAttribute('class', 'level-line');
    svg.appendChild(lvl);
  }

  // draw edges with L/R labels
  for (const [a,b] of edgesFrom(bstSession.state.root)) {
    const pa = idToPos.get(a); const pb = idToPos.get(b);
    if (!pa || !pb) continue;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', pa.x);
    line.setAttribute('y1', pa.y);
    line.setAttribute('x2', pb.x);
    line.setAttribute('y2', pb.y);
    line.setAttribute('class', 'edge');
    svg.appendChild(line);

    // label
    const label = document.createElementNS('http://www.w3.org/2000/svg','text');
    const mx = (pa.x + pb.x) / 2; const my = (pa.y + pb.y) / 2;
    label.setAttribute('x', String(mx));
    label.setAttribute('y', String(my - 4));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'edge-label');
    label.textContent = pb.x < pa.x ? 'L' : 'R';
    svg.appendChild(label);
  }

  // draw nodes
  const step = (bstSession.steps && bstSession.steps[idx]) || null;
  const highlight = step?.highlight || {};
  // Maintain a map of existing nodes in the DOM to animate positions
  const domById = new Map();
  // If previous layer existed, reuse nodes (not needed here since we recreate, but left for future incremental updates)
  for (const n of nodes) {
    let div = domById.get(n.id);
    if (!div) {
      div = document.createElement('div');
      div.className = 'bst-node';
      div.textContent = n.key;
      nodesLayer.appendChild(div);
      domById.set(n.id, div);
    }
    div.style.left = `${n.x}px`;
    div.style.top = `${n.y}px`;
    div.classList.toggle('current', highlight.nodeId === n.id && (highlight.op?.includes('visit') || highlight.op === 'insert-visit' || highlight.op === 'search-visit'));
    div.classList.toggle('new', highlight.nodeId === n.id && highlight.op === 'insert-new');
    div.classList.toggle('found', highlight.nodeId === n.id && highlight.op === 'search-result' && highlight.found);
  }

  if (nodes.length === 0) {
    const empty = document.createElement('div');
    empty.style.position = 'absolute';
    empty.style.left = '50%';
    empty.style.top = '50%';
    empty.style.transform = 'translate(-50%, -50%)';
    empty.style.color = 'var(--muted)';
    empty.style.fontSize = '14px';
    empty.textContent = 'BST is empty. Use Insert to add a node.';
    treeVisual.appendChild(empty);
  }
  if ((bstSession.steps?.length || 0) > 0) {
    stepCounter.textContent = `Step ${idx + 1}/${bstSession.steps.length}`;
  } else {
    stepCounter.textContent = 'Step 0/0';
  }
  // Update pseudocode highlighting for the current BST step
  renderCode(bstSession?.pseudocode ?? [], step?.hlLines ?? []);
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
  if (currentType === 'trees') {
    // trees render path uses bstSession
    if (!bstSession) ensureBSTInitialized(arr);
    idx = Math.max(0, Math.min(idx, (bstSession.steps?.length || 1) - 1));
    renderBSTStep();
  } else {
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
}

function setStep(i) {
  const currentType = algoType.value;
  if (currentType === 'trees') {
    if (!bstSession?.steps?.length) return;
    idx = Math.max(0, Math.min(i, bstSession.steps.length - 1));
    renderBSTStep();
  } else {
    if (!steps.length) return;
    idx = Math.max(0, Math.min(i, steps.length - 1));
    renderCurrentStep();
  }
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
  const currentType = algoType.value;
  const total = currentType === 'trees' ? (bstSession?.steps?.length || 0) : steps.length;
  if (idx < total - 1) {
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
  if (algoType.value === 'trees') {
    ensureBSTInitialized();
    idx = 0;
    renderBSTStep();
  } else {
    buildSteps(algoSelect.value, arr, target);
  }
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

// BST handlers
function ensureBSTInitialized(initialArr) {
  if (!bstSession) {
    let init = Array.isArray(initialArr) && initialArr.length ? initialArr : parseArray(arrayInput.value);
    if (!init || init.length === 0) {
      // provide a sensible default demo tree
      init = [8,3,10,1,6,14,4,7,13];
    }
    const unique = [...new Set(init)];
    bstSession = createBST(unique);
    // set session data
    bstSession.pseudocode = bstSession.steps?.length ? bstSession.pseudocode : bstSession.pseudocode;
    idx = Math.max(0, bstSession.steps.length - 1);
  }
}

bstInsertBtn.onclick = () => {
  ensureBSTInitialized();
  const v = Number(bstValue.value);
  if (!Number.isFinite(v)) return;
  const before = bstSession.steps.length;
  bstSession.api.insert(v);
  idx = before; // jump to first new step
  renderBSTStep();
};

bstSearchBtn.onclick = () => {
  ensureBSTInitialized();
  const v = Number(bstValue.value);
  if (!Number.isFinite(v)) return;
  const before = bstSession.steps.length;
  bstSession.api.search(v);
  idx = before;
  renderBSTStep();
};

bstClearBtn.onclick = () => {
  // Reset to a fresh empty BST session
  bstSession = createBST([]);
  idx = 0;
  renderBSTStep();
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
