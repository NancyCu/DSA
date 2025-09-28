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
let bstNodeEls = new Map(); // id -> HTMLElement, persistent for animations
let bstTravelEl = null; // DOM element for traveling insert bubble
let bstTravelKey = null;

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
const analysisBody = document.getElementById('analysisBody');
const analysisFoot = document.getElementById('analysisFoot');
const analysisControls = document.getElementById('analysisControls');
const analysisModeSel = document.getElementById('analysisMode');
const analysisModeWrap = document.getElementById('analysisModeWrap');
const analysisNumeric = document.getElementById('analysisNumeric');
const analysisC = document.getElementById('analysisC');

// ---- Persistence for analysis controls ----
const LS_KEYS = {
  numeric: 'visudsa.analysis.numeric',
  c: 'visudsa.analysis.c',
  mode: 'visudsa.analysis.mode',
};
try {
  const savedNum = localStorage.getItem(LS_KEYS.numeric);
  if (savedNum != null && analysisNumeric) analysisNumeric.checked = savedNum === '1';
  const savedC = localStorage.getItem(LS_KEYS.c);
  if (savedC != null && analysisC) analysisC.value = savedC;
  const savedMode = localStorage.getItem(LS_KEYS.mode);
  if (savedMode && analysisModeSel) analysisModeSel.value = savedMode;
} catch {}

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
function computePositions(root, width, levelHeight, opts = {}) {
  // Subtree-width-based tidy layout
  // Returns array of {id, key, x, y}
  const res = [];
  if (!root) return res;

  const MIN_GAP = typeof opts.minGap === 'number' ? opts.minGap : 56; // px
  const PADDING = typeof opts.padding === 'number' ? opts.padding : 20; // px

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
    if (!node) return null;
    const W = widths.get(node.id) || MIN_GAP;
    const wl = node.left ? (widths.get(node.left.id) || MIN_GAP) : 0;
    const wr = node.right ? (widths.get(node.right.id) || MIN_GAP) : 0;
    const childrenTotal = wl + wr;
    const leftStart = xStartUnits + Math.max(0, (W - childrenTotal) / 2);

    const leftCenter = node.left ? layout(node.left, leftStart, depth + 1) : null;
    const rightCenter = node.right ? layout(node.right, leftStart + wl, depth + 1) : null;

    let centerUnits;
    if (leftCenter != null && rightCenter != null) centerUnits = (leftCenter + rightCenter) / 2;
    else if (leftCenter != null) centerUnits = leftCenter;
    else if (rightCenter != null) centerUnits = rightCenter;
    else centerUnits = xStartUnits + W / 2;

    const x = PADDING + centerUnits * scale;
    const y = (depth + 1) * levelHeight;
    res.push({ id: node.id, key: node.key, x, y });
    return centerUnits;
  }

  layout(root, 0, 0);
  return res;
}

function depthOf(node){
  if (!node) return 0;
  return 1 + Math.max(depthOf(node.left), depthOf(node.right));
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
  let nodesLayer = document.createElement('div');
  nodesLayer.className = 'bst-nodes-layer';
  treeVisual.appendChild(nodesLayer);
  const w = treeVisual.clientWidth || 700;
  const h = treeVisual.clientHeight || 400;
  const step = (bstSession.steps && bstSession.steps[idx]) || null;
  const rootForStep = step?.tree || bstSession.state.root;
  // Compute depth to fit vertical space
  const d = Math.max(1, depthOf(rootForStep));
  const levelH = Math.max(56, Math.min(110, (h - 40) / d));
  // Adaptive horizontal gap by viewport width
  const minGap = Math.max(36, Math.min(90, w / 12));
  const nodes = computePositions(rootForStep, w, levelH, { minGap, padding: Math.max(10, Math.min(24, w * 0.03)) });
  const idToPos = new Map(nodes.map(n => [n.id, n]));

  // level guide lines
  const depthMax = Math.max(1, d);
  for (let i = 1; i <= Math.min(8, depthMax); i++) {
    const y = i * levelH;
    const lvl = document.createElementNS('http://www.w3.org/2000/svg','line');
    lvl.setAttribute('x1', '0');
    lvl.setAttribute('x2', String(w));
    lvl.setAttribute('y1', String(y));
    lvl.setAttribute('y2', String(y));
    lvl.setAttribute('class', 'level-line');
    svg.appendChild(lvl);
  }

  // draw edges with L/R labels
  // determine active edge for this step (if comparing and choosing L/R)
  let activeA = null, activeB = null;
  if (step?.highlight?.dir && step?.highlight?.nodeId) {
    // find the parent node in this snapshot
    const findNode = (node, id) => !node ? null : (node.id === id ? node : (findNode(node.left, id) || findNode(node.right, id)));
    const parentNode = findNode(rootForStep, step.highlight.nodeId);
    if (parentNode) {
      const child = step.highlight.dir === 'L' ? parentNode.left : parentNode.right;
      if (child) { activeA = parentNode.id; activeB = child.id; }
    }
  }

  for (const [a,b] of edgesFrom(rootForStep)) {
    const pa = idToPos.get(a); const pb = idToPos.get(b);
    if (!pa || !pb) continue;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', pa.x);
    line.setAttribute('y1', pa.y);
    line.setAttribute('x2', pb.x);
    line.setAttribute('y2', pb.y);
    line.setAttribute('class', 'edge');
    if (activeA === a && activeB === b) line.classList.add('edge-active');
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
  const highlight = step?.highlight || {};
  // Animate nodes: reuse DOM elements across renders
  const presentIds = new Set(nodes.map(n => n.id));
  // Remove orphaned
  for (const [id, el] of bstNodeEls.entries()) {
    if (!presentIds.has(id)) {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 200);
      bstNodeEls.delete(id);
    }
  }
  for (const n of nodes) {
    let div = bstNodeEls.get(n.id);
    if (!div) {
      div = document.createElement('div');
      div.className = 'bst-node';
      div.textContent = n.key;
      div.style.opacity = '0';
      nodesLayer.appendChild(div);
      // next frame fade-in
      requestAnimationFrame(() => { div.style.opacity = '1'; });
      bstNodeEls.set(n.id, div);
    }
    // ensure element is attached to current layer (after re-render clears container)
    if (div.parentElement !== nodesLayer) {
      nodesLayer.appendChild(div);
    }
    // update position (animates via CSS transition)
    div.style.left = `${n.x}px`;
    div.style.top = `${n.y}px`;
    // update classes
    div.classList.toggle('current', highlight.nodeId === n.id && (highlight.op?.includes('visit') || highlight.op === 'insert-visit' || highlight.op === 'search-visit'));
    div.classList.toggle('new', highlight.nodeId === n.id && highlight.op === 'insert-new');
    div.classList.toggle('found', highlight.nodeId === n.id && highlight.op === 'search-result' && highlight.found);

    // pulse on the active current node
    const shouldPulse = highlight.nodeId === n.id && (highlight.op?.includes('visit') || highlight.op === 'insert-visit' || highlight.op === 'search-visit');
    if (shouldPulse) {
      // restart animation by removing and re-adding the class
      div.classList.remove('pulse');
      // force reflow
      void div.offsetWidth;
      div.classList.add('pulse');
    }
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
  // Update analysis table for BST levels (informative, not exact TC)
  if (rootForStep) {
    const byLevelCounts = [];
    const q = [[rootForStep, 0]];
    while (q.length) {
      const [node, lv] = q.shift();
      byLevelCounts[lv] = (byLevelCounts[lv] || 0) + 1;
      if (node.left) q.push([node.left, lv + 1]);
      if (node.right) q.push([node.right, lv + 1]);
    }
    const rows = byLevelCounts.map((cnt, lv) => ({ level: lv, arg: '—', tc1: 'visit', nodes: cnt, levelTC: `${cnt}·visit` }));
    renderAnalysis({ rows });
  } else {
    renderAnalysis(null);
  }

  // Traveling bubble logic for insert
  if (highlight && (highlight.op === 'insert-visit' || highlight.op === 'cmp' || highlight.op === 'ret' || highlight.op === 'insert-new')) {
    const key = highlight.key;
    if (key != null) {
      const posForNodeId = (id) => idToPos.get(id) || null;
      if (!bstTravelEl) {
        bstTravelEl = document.createElement('div');
        bstTravelEl.className = 'bst-travel';
        bstTravelEl.style.opacity = '0';
        treeVisual.appendChild(bstTravelEl);
      }
      if (bstTravelKey !== key) { bstTravelEl.textContent = key; bstTravelKey = key; }
      let targetPos = null;
      if (highlight.op === 'insert-new' && highlight.nodeId) targetPos = posForNodeId(highlight.nodeId);
      else if (highlight.nodeId) targetPos = posForNodeId(highlight.nodeId);
      if (targetPos) {
        const dx = (highlight.dir === 'R' ? 16 : -16);
        const dy = -18;
        if (bstTravelEl.style.opacity !== '1' && idToPos.size > 0) {
          const rootId = (rootForStep && rootForStep.id) ? rootForStep.id : null;
          const rootPos = rootId ? posForNodeId(rootId) : targetPos;
          if (rootPos) {
            bstTravelEl.style.left = `${rootPos.x + dx}px`;
            bstTravelEl.style.top = `${rootPos.y + dy}px`;
          }
          requestAnimationFrame(() => { bstTravelEl.style.opacity = '1'; });
        }
        bstTravelEl.style.left = `${targetPos.x + dx}px`;
        bstTravelEl.style.top = `${targetPos.y + dy}px`;
      }
      if (highlight.op === 'insert-new') {
        setTimeout(() => {
          if (bstTravelEl) {
            bstTravelEl.style.opacity = '0';
            setTimeout(() => { bstTravelEl?.remove(); bstTravelEl = null; bstTravelKey = null; }, 250);
          }
        }, 250);
      }
    }
  } else {
    if (bstTravelEl) {
      bstTravelEl.style.opacity = '0';
      setTimeout(() => { bstTravelEl?.remove(); bstTravelEl = null; bstTravelKey = null; }, 250);
    }
  }
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

function renderAnalysis(model) {
  if (!analysisBody) return;
  if (!model || !Array.isArray(model.rows) || model.rows.length === 0) {
    analysisBody.innerHTML = '';
    if (analysisFoot) analysisFoot.innerHTML = '';
    if (analysisControls) analysisControls.style.display = 'none';
    return;
  }
  analysisBody.innerHTML = model.rows
    .map((r, i) => `<tr class="${i === model.hlIndex ? 'hl' : ''}"><td>${r.level}</td><td>${r.arg}</td><td>${r.tc1}</td><td>${r.nodes}</td><td>${r.levelTC}</td></tr>`) 
    .join('');
  if (analysisFoot) {
    const totalSym = model.totalSym ?? model.total ?? '';
    const totalNum = model.totalNum ?? '';
    const both = totalNum && totalSym && totalNum !== totalSym;
    const totalCell = both ? `<div>${totalSym}</div><div>${totalNum}</div>` : (totalNum || totalSym);
    analysisFoot.innerHTML = `<tr><td colspan="4">Total</td><td>${totalCell}</td></tr>`;
  }
  if (analysisControls) analysisControls.style.display = model.showControls ? 'flex' : 'none';
}

// --- Analysis builders ---
function fmt(expr){ return String(expr).replace(/\*\*/g,'^'); }

function analysisDivideAndConquer(n, algoKey, options = {}) {
  if (!n || n <= 0) return { rows: [] };
  const rows = [];
  let level = 0;
  let size = n;
  // Determine variant: +c (per node constant) vs +cn (per node linear)
  const k = Math.ceil(Math.log2(n));
  const isQS = algoKey === 'quickSort';
  const isWorstQS = isQS && options.mode === 'worst';
  const plusCN = (algoKey === 'mergeSort') || (isQS && options.mode === 'avg');
  const numeric = !!options.numeric;
  const cval = Number(options.c) || 1;

  if (isWorstQS) {
    // Worst-case Quick Sort: T(n) = T(n-1) + cn; 1 node per level, tc1 = c·(n - level)
    const maxRows = n > 16 ? 6 : n; // clip for readability
    for (let l = 0; l < Math.min(n, maxRows); l++) {
      const m = n - l;
      const tc1 = numeric ? `${cval*m}` : `c·${m}`;
      const levelTC = tc1;
      rows.push({ level: l, arg: `${m}`, tc1, nodes: 1, levelTC });
    }
    if (n > maxRows) rows.push({ level: '…', arg: '…', tc1: '…', nodes: '…', levelTC: '…' });
    const total = numeric ? `${cval}·${n}(${n}+1)/2 = ${cval * n * (n+1) / 2}` : `= c·n(n+1)/2 ≈ (c/2)·${n}²`;
    const showControls = true;
    return { rows, total, showControls, hlIndex: Math.min(options.currentLevel ?? 0, rows.length - 1) };
  }

  while (size > 1) {
    const argSym = level === 0 ? 'n' : `n/2^${level}`;
    const arg = numeric ? `${Math.max(1, Math.round(n/Math.pow(2,level)))}` : argSym;
    const nodes = numeric ? `${Math.pow(2,level)}` : `2^${level}`;
    const tc1 = plusCN ? (numeric ? `${cval}·${Math.max(1, Math.round(n/Math.pow(2,level)))}` : `c·${argSym}`) : (numeric ? `${cval}` : `c`);
    const levelTC = plusCN ? (numeric ? `${cval*n}` : `c·n`) : (numeric ? `${cval*Math.pow(2,level)}` : `c·2^${level}`);
    rows.push({ level, arg, tc1, nodes, levelTC });
    level++;
    size = Math.ceil(size / 2);
  }
  // base level (size ~ 1)
  rows.push({ level, arg: '1', tc1: numeric ? `${cval}` : 'c', nodes: numeric ? `${Math.pow(2,level)}` : `2^${level}`, levelTC: numeric ? `${cval*Math.pow(2,level)}` : `c·2^${level}` });
  // Clip with ellipsis for long tables
  const maxRows = 10;
  if (rows.length > maxRows) {
    const head = rows.slice(0, 4);
    const tail = rows.slice(-2);
    const ellipsis = { level: '…', arg: '…', tc1: '…', nodes: '…', levelTC: '…' };
    rows.splice(0, rows.length, ...head, ellipsis, ...tail);
  }
  let totalSym, totalNum;
  if (plusCN) {
    totalSym = `≈ c·${n}·log₂${n} + c·2^${k}`;
    totalNum = numeric ? `${cval*n*Math.ceil(Math.log2(n)) + cval*Math.pow(2,k)}` : '';
  } else {
    totalSym = `≈ c·(2^{${k}+1} - 1)`;
    totalNum = numeric ? `${cval*(Math.pow(2,k+1)-1)}` : '';
  }
  const showControls = isQS;
  return { rows, totalSym, totalNum, showControls, hlIndex: Math.min(options.currentLevel ?? 0, rows.length - 1) };
}

function analysisBinarySearch(steps, currentIdx) {
  if (!steps || steps.length === 0) return { rows: [] };
  const rows = [];
  for (let i = 0; i <= currentIdx && i < steps.length; i++) {
    const s = steps[i];
    if (s && Array.isArray(s.array)) {
      const left = s.left ?? NaN;
      const right = s.right ?? NaN;
      const mid = s.mid ?? NaN;
      const range = (Number.isFinite(left) && Number.isFinite(right)) ? (right - left + 1) : '-';
      rows.push({ level: i, arg: `|range|=${range}`, tc1: 'c', nodes: 1, levelTC: 'c' });
    }
  }
  const total = `${rows.length}·c ≈ O(log₂n)`;
  return { rows, total };
}

function analysisLinearSearch(steps, currentIdx) {
  if (!steps || steps.length === 0) return { rows: [] };
  const rows = [];
  for (let i = 0; i <= currentIdx && i < steps.length; i++) {
    const s = steps[i];
    if (s && Array.isArray(s.nodes)) {
      const idx = s.currentNode ?? NaN;
      rows.push({ level: i, arg: Number.isFinite(idx) ? `i=${idx}` : '—', tc1: 'c', nodes: 1, levelTC: 'c' });
    }
  }
  const total = rows.length ? `${rows.length}·c` : '';
  return { rows, total };
}

function analysisSimpleSort(step, n) {
  if (!step) return { rows: [] };
  const rows = [ { level: idx + 1, arg: `n=${n}`, tc1: 'c', nodes: 1, levelTC: 'c' } ];
  return { rows, total: `${idx + 1}·c` };
}

function renderCurrentStep() {
  const currentType = algoType.value;
  if (currentType === 'sorting') {
    renderBars(steps[idx]);
    // Populate recursion analysis for divide-and-conquer sorts
    const algoKey = algoSelect.value;
    const n = steps?.[0]?.array?.length || parseArray(arrayInput.value).length || 0;
    if (n && (algoKey === 'mergeSort' || algoKey === 'quickSort')) {
      const mode = (algoKey === 'quickSort') ? (analysisModeSel?.value || 'avg') : undefined;
      // Infer current recursion level by the size of the currently highlighted segment if possible
      let currentLevel = 0;
      const s = steps[idx];
      let subSize = null;
      if (s?.segment && (typeof s.segment.left === 'number' && typeof s.segment.right === 'number')) {
        subSize = s.segment.right - s.segment.left + 1;
      } else if (s?.segment && (typeof s.segment.low === 'number' && typeof s.segment.high === 'number')) {
        subSize = s.segment.high - s.segment.low + 1;
      } else {
        const sel = Array.isArray(s?.sel) ? s.sel : [];
        if (sel.length > 0) {
          const minI = Math.min(...sel), maxI = Math.max(...sel);
          subSize = (Number.isFinite(minI) && Number.isFinite(maxI)) ? (maxI - minI + 1) : null;
        } else {
          const cmp = Array.isArray(s?.compare) ? s.compare : [];
          if (cmp.length >= 1) {
            const minI = Math.min(...cmp), maxI = Math.max(...cmp);
            subSize = (Number.isFinite(minI) && Number.isFinite(maxI)) ? (maxI - minI + 1) : null;
          }
        }
      }
      if (subSize != null && subSize > 0) {
        const lvl = Math.round(Math.log2(n / Math.max(1, subSize)));
        if (Number.isFinite(lvl) && lvl >= 0) currentLevel = Math.min(lvl, 64);
      }
      const numeric = !!analysisNumeric?.checked;
      const c = Number(analysisC?.value) || 1;
      const model = analysisDivideAndConquer(n, algoKey, { mode, numeric, c, currentLevel });
      if (analysisControls) analysisControls.style.display = 'flex';
      if (analysisModeWrap) analysisModeWrap.style.display = (algoKey === 'quickSort') ? 'inline-flex' : 'none';
      renderAnalysis(model);
    } else {
      if (analysisControls) analysisControls.style.display = 'flex';
      if (analysisModeWrap) analysisModeWrap.style.display = 'none';
      renderAnalysis(analysisSimpleSort(steps[idx], n));
    }
  } else {
    const algoKey = algoSelect.value;
    if (algoKey === 'linearSearch') {
      renderLinkedList(steps[idx]);
      renderAnalysis(analysisLinearSearch(steps, idx));
    } else if (algoKey === 'binarySearch') {
      renderBinarySearchArray(steps[idx]);
      renderAnalysis(analysisBinarySearch(steps, idx));
    }
  }
  renderCode(run?.pseudocode ?? [], steps[idx]?.hlLines ?? []);
}

// Handle analysis mode change
if (analysisModeSel) {
  analysisModeSel.onchange = () => {
    // trigger re-render to update analysis
    try { localStorage.setItem(LS_KEYS.mode, analysisModeSel.value); } catch {}
    renderCurrentStep();
  };
}
if (analysisNumeric) {
  analysisNumeric.onchange = () => { try { localStorage.setItem(LS_KEYS.numeric, analysisNumeric.checked ? '1' : '0'); } catch {} renderCurrentStep(); };
}
if (analysisC) {
  analysisC.onchange = () => { try { localStorage.setItem(LS_KEYS.c, analysisC.value); } catch {} renderCurrentStep(); };
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

// Re-render tree on container resize for responsiveness
if (window.ResizeObserver) {
  const ro = new ResizeObserver(() => {
    if (algoType.value === 'trees') {
      renderBSTStep();
    }
  });
  ro.observe(document.getElementById('treeVisual'));
} else {
  window.addEventListener('resize', () => {
    if (algoType.value === 'trees') {
      renderBSTStep();
    }
  });
}
