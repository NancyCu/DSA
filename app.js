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
// Final Big O summary banner
const analysisSummary = document.getElementById('analysisSummary');
const analysisBigO = document.getElementById('analysisBigO');
// Track last highlighted analysis row to animate changes
let analysisLastHL = null;
// Inputs panel controls
const inputsToggle = document.getElementById('inputsToggle');
const inputsPanel = document.querySelector('.inputs-panel');
const inputsBody = document.getElementById('inputsBody');
const inputsHint = document.getElementById('inputsHint');
const sortedToggle = document.getElementById('sortedToggle');
const arraySizeInput = document.getElementById('arraySize');
const resetBtn = document.getElementById('resetBtn');
const miniToolbar = document.getElementById('miniToolbar');
const miniRandom = document.getElementById('miniRandom');
const miniLoad = document.getElementById('miniLoad');
const miniPlay = document.getElementById('miniPlay');
const hapticsToggle = document.getElementById('hapticsToggle');
const bstFitToggle = document.getElementById('bstFitToggle');
const bstFitWrap = document.getElementById('bstFitWrap');
const bstResetBtn = document.getElementById('bstResetBtn');

// ---- Persistence for analysis controls ----
const LS_KEYS = {
  numeric: 'visudsa.analysis.numeric',
  c: 'visudsa.analysis.c',
  mode: 'visudsa.analysis.mode',
  algoType: 'visudsa.ui.algoType',
  algo_sorting: 'visudsa.ui.algo.sorting',
  algo_searching: 'visudsa.ui.algo.searching',
  algo_trees: 'visudsa.ui.algo.trees',
  inputsCollapsed: 'visudsa.ui.inputsCollapsed',
  sortedAfterRandom: 'visudsa.ui.sortedAfterRandom',
  randomSize: 'visudsa.ui.randomSize',
  haptics: 'visudsa.ui.haptics',
  bstFit: 'visudsa.ui.bstFit',
  bstFitUserSet: 'visudsa.ui.bstFit.userSet',
};
try {
  const savedNum = localStorage.getItem(LS_KEYS.numeric);
  if (savedNum != null && analysisNumeric) analysisNumeric.checked = savedNum === '1';
  const savedC = localStorage.getItem(LS_KEYS.c);
  if (savedC != null && analysisC) analysisC.value = savedC;
  const savedMode = localStorage.getItem(LS_KEYS.mode);
  if (savedMode && analysisModeSel) analysisModeSel.value = savedMode;
  const collapsed = localStorage.getItem(LS_KEYS.inputsCollapsed) === '1';
  if (inputsBody && inputsToggle) {
    if (collapsed) {
      inputsBody.classList.add('collapsed');
  inputsToggle.setAttribute('aria-expanded','false');
  inputsToggle.textContent = '›';
      if (miniToolbar) miniToolbar.style.display = 'flex';
      if (inputsPanel) inputsPanel.classList.add('is-collapsed');
      if (inputsHint) inputsHint.style.visibility = 'visible';
    } else {
  inputsToggle.setAttribute('aria-expanded','true');
  inputsToggle.textContent = '⌄';
      if (miniToolbar) miniToolbar.style.display = 'none';
      if (inputsPanel) inputsPanel.classList.remove('is-collapsed');
      if (inputsHint) inputsHint.style.visibility = 'hidden';
    }
  }
  const sortedPref = localStorage.getItem(LS_KEYS.sortedAfterRandom);
  if (sortedPref != null && sortedToggle) sortedToggle.checked = sortedPref === '1';
  const savedSize = localStorage.getItem(LS_KEYS.randomSize);
  if (savedSize != null && arraySizeInput) arraySizeInput.value = savedSize;
  // Haptics preference: default enable on touch devices if not saved
  const savedH = localStorage.getItem(LS_KEYS.haptics);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (hapticsToggle) {
    if (savedH != null) hapticsToggle.checked = savedH === '1';
    else hapticsToggle.checked = isTouch;
  }
  const savedFit = localStorage.getItem(LS_KEYS.bstFit);
  if (bstFitToggle) {
    if (savedFit == null) {
      const preferFit = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
      bstFitToggle.checked = preferFit;
      try { localStorage.setItem(LS_KEYS.bstFit, preferFit ? '1' : '0'); } catch {}
      try { localStorage.setItem(LS_KEYS.bstFitUserSet, '0'); } catch {}
    } else {
      bstFitToggle.checked = savedFit === '1';
    }
  }
} catch {}
// Auto-collapse by default on small screens if no preference saved
try {
  const hasPref = localStorage.getItem(LS_KEYS.inputsCollapsed) !== null;
  if (!hasPref && window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
    if (inputsBody && inputsToggle && !inputsBody.classList.contains('collapsed')) {
  inputsBody.classList.add('collapsed');
  inputsToggle.setAttribute('aria-expanded','false');
  inputsToggle.textContent = '›';
      if (miniToolbar) miniToolbar.style.display = 'flex';
      if (inputsPanel) inputsPanel.classList.add('is-collapsed');
      if (inputsHint) inputsHint.style.visibility = 'visible';
    }
  }
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

  // restore saved algorithm for this type if available
  try {
    const keyName = currentType === 'sorting' ? LS_KEYS.algo_sorting : (currentType === 'searching' ? LS_KEYS.algo_searching : LS_KEYS.algo_trees);
    const savedAlgo = localStorage.getItem(keyName);
    if (savedAlgo && Object.prototype.hasOwnProperty.call(algorithms, savedAlgo)) {
      algoSelect.value = savedAlgo;
    }
  } catch {}
  
  // Show/hide search target input
  const isSearching = currentType === 'searching';
  const isTrees = currentType === 'trees';
  const searchField = document.getElementById('searchField');
  if (searchField) searchField.style.display = isSearching ? 'grid' : 'none';
  searchTarget.style.display = isSearching ? 'block' : 'none';
  searchTargetLabel.style.display = isSearching ? 'inline' : 'none';
  visual.style.display = isSearching || isTrees ? 'none' : 'block';
  searchVisual.style.display = isSearching ? 'block' : 'none';
  treeVisual.style.display = isTrees ? 'block' : 'none';
  if (bstFitWrap) bstFitWrap.style.display = isTrees ? 'inline-flex' : 'none';
  if (bstResetBtn) bstResetBtn.style.display = isTrees ? 'inline-block' : 'none';

  // toggle BST controls
  const bstField = document.getElementById('bstField');
  if (bstField) bstField.style.display = isTrees ? 'grid' : 'none';
  const bstControls = [bstValueLabel, bstValue, bstInsertBtn, bstSearchBtn, bstClearBtn];
  bstControls.forEach(el => el.style.display = isTrees ? (el.tagName === 'INPUT' || el.tagName === 'LABEL' ? 'block' : 'inline-block') : 'none');

  // Toggle array controls for Trees mode
  const arrayControls = [document.getElementById('arrayField'), document.getElementById('arrayButtons')];
  arrayControls.forEach(el => { if (el) el.style.display = isTrees ? 'none' : 'grid'; });

  if (isTrees) {
    ensureBSTInitialized();
    renderBSTStep();
    renderComplexity({ complexity: { best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)' }, space: 'O(h)' });
    renderCode(bstSession?.pseudocode ?? [], []);
    // If entering trees mode in portrait and no explicit user preference, auto-enable fit
    maybeAutoEnableFit();
  }
}

let steps = [];
let run = null;
let idx = 0;
let playing = false;
let timer = null;

function parseArray(text) {
  // Split by comma or whitespace, supporting both formats for mobile compatibility
  return text
    .split(/[,\s]+/)
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
    
    // Add click handler for custom pivot selection in quicksort
    if (algoSelect.value === 'quickSort' && currentPivotStrategy === 'custom') {
      bar.classList.add('clickable-pivot');
      bar.addEventListener('click', () => selectCustomPivot(i));
    }
    
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
  treeVisual.classList.toggle('fit', !!bstFitToggle?.checked);
  // Wrap layers to allow scaling
  const zoomWrap = document.createElement('div');
  zoomWrap.className = 'zoom-wrap';
  treeVisual.appendChild(zoomWrap);
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('edges-layer');
  zoomWrap.appendChild(svg);
  let nodesLayer = document.createElement('div');
  nodesLayer.className = 'bst-nodes-layer';
  zoomWrap.appendChild(nodesLayer);
  const w = treeVisual.clientWidth || 700;
  const h = treeVisual.clientHeight || 400;
  const step = (bstSession.steps && bstSession.steps[idx]) || null;
  const rootForStep = step?.tree || bstSession.state.root;
  // Compute depth to fit vertical space
  const d = Math.max(1, depthOf(rootForStep));
  // Responsive vertical spacing: allow tighter packing on mobile
  const isNarrow = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  const minLevel = isNarrow ? 44 : 56;
  const maxLevel = isNarrow ? 96 : 110;
  const levelH = Math.max(minLevel, Math.min(maxLevel, (h - 40) / d));
  // Adaptive horizontal gap by viewport width
  const minGap = Math.max(isNarrow ? 28 : 36, Math.min(isNarrow ? 72 : 90, w / 12));
  const nodes = computePositions(rootForStep, w, levelH, { minGap, padding: Math.max(8, Math.min(isNarrow ? 18 : 24, w * 0.03)) });
  const idToPos = new Map(nodes.map(n => [n.id, n]));

  // Auto-zoom to fit if enabled
  if (bstFitToggle?.checked && nodes.length > 0) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodes) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y); }
    // Expand bounds with a visual margin
    const margin = 16;
    const bx = minX - margin;
    const by = minY - margin;
    const bw = Math.max(1, (maxX - minX) + margin * 2);
    const bh = Math.max(1, (maxY - minY) + margin * 2);
  const scaleBase = Math.min(w / bw, h / bh);
  // Clamp scaling: smaller upscaling on mobile, larger on desktop
  const maxScale = isNarrow ? 1.05 : 1.8;
  const minScale = isNarrow ? 0.35 : 0.45;
  const scale = Math.max(minScale, Math.min(scaleBase, maxScale));
    // Center content after scaling
    const cx = (w - bw * scale) / 2 - bx * scale;
    const cy = (h - bh * scale) / 2 - by * scale;
    zoomWrap.style.transform = `translate(${cx}px, ${cy}px) scale(${scale})`;
  }

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

  // Depth-aware node sizing (smaller nodes for deeper trees)
  const baseNode = isNarrow ? 30 : 36;
  const minNode = isNarrow ? 24 : 28;
  const nodeSize = Math.max(minNode, Math.min(baseNode, Math.round(baseNode - Math.max(0, d - 3) * 2)));

  for (const [a,b] of edgesFrom(rootForStep)) {
    const pa = idToPos.get(a); const pb = idToPos.get(b);
    if (!pa || !pb) continue;
    
    // Create slanted line for triangle effect
    // Adjust connection points to create angled lines from node centers
    const nodeRadius = nodeSize / 2;
    const dx = pb.x - pa.x;
    const dy = pb.y - pa.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate edge points on the node circles rather than centers
    const x1 = pa.x + (dx / distance) * nodeRadius;
    const y1 = pa.y + (dy / distance) * nodeRadius;
    const x2 = pb.x - (dx / distance) * nodeRadius;
    const y2 = pb.y - (dy / distance) * nodeRadius;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', 'edge');
    if (activeA === a && activeB === b) line.classList.add('edge-active');
    svg.appendChild(line);

    // label positioned along the slanted line
    const label = document.createElementNS('http://www.w3.org/2000/svg','text');
    const mx = (x1 + x2) / 2; 
    const my = (y1 + y2) / 2;
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
    // update size and classes
    div.style.width = `${nodeSize}px`;
    div.style.height = `${nodeSize}px`;
    div.style.lineHeight = `${nodeSize}px`;
    div.style.fontSize = `${nodeSize <= 26 ? 12 : 14}px`;
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
    const levelById = new Map();
    const q = [[rootForStep, 0]];
    while (q.length) {
      const [node, lv] = q.shift();
      byLevelCounts[lv] = (byLevelCounts[lv] || 0) + 1;
      levelById.set(node.id, lv);
      if (node.left) q.push([node.left, lv + 1]);
      if (node.right) q.push([node.right, lv + 1]);
    }
    const rows = byLevelCounts.map((cnt, lv) => ({ level: lv, arg: '—', tc1: 'visit', nodes: cnt, levelTC: `${cnt}·visit` }));
    let hlIndex = null;
    if (step?.highlight?.nodeId != null && levelById.has(step.highlight.nodeId)) {
      hlIndex = levelById.get(step.highlight.nodeId);
    }
    renderAnalysis({ rows, hlIndex });
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
  // Hide Big O banner in Trees mode (informational table only)
  if (analysisSummary) {
    analysisSummary.classList.remove('is-visible');
    analysisSummary.style.display = 'none';
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
  
  // Set up interactive quicksort controls if it's quicksort
  if (algoSelect.value === 'quickSort') {
    setupInteractiveQuickSort();
  }
}

// Global variables for quicksort interactivity
let currentPivotStrategy = 'last';
let customPivotSelections = [];
let pivotSelectionStep = 0;

function setupInteractiveQuickSort() {
  const pivotStrategySelect = document.getElementById('pivotStrategy');
  const resetPivotsBtn = document.getElementById('resetPivots');
  const customPivotInfo = document.getElementById('customPivotInfo');
  
  if (pivotStrategySelect) {
    pivotStrategySelect.value = currentPivotStrategy;
    pivotStrategySelect.addEventListener('change', (e) => {
      currentPivotStrategy = e.target.value;
      customPivotInfo.style.display = e.target.value === 'custom' ? 'block' : 'none';
      
      if (e.target.value !== 'custom') {
        // Regenerate algorithm with new pivot strategy
        regenerateQuickSortWithStrategy(currentPivotStrategy);
      } else {
        // Reset custom selections and prepare for user input
        customPivotSelections = [];
        pivotSelectionStep = 0;
        updateCustomPivotVisualization();
      }
    });
  }
  
  if (resetPivotsBtn) {
    resetPivotsBtn.addEventListener('click', () => {
      customPivotSelections = [];
      pivotSelectionStep = 0;
      if (currentPivotStrategy === 'custom') {
        updateCustomPivotVisualization();
      } else {
        regenerateQuickSortWithStrategy(currentPivotStrategy);
      }
    });
  }
  
  // Initial render
  renderInteractiveQuickSortTables();
}

function regenerateQuickSortWithStrategy(strategy) {
  const arr = parseArray(arrayInput.value);
  currentPivotStrategy = strategy;
  
  stopPlaying();
  buildSteps('quickSort', arr);
}

function updateCustomPivotVisualization() {
  if (currentPivotStrategy === 'custom') {
    // Make the main array elements clickable for pivot selection
    const elements = document.querySelectorAll('#visual .element');
    elements.forEach((el, index) => {
      el.classList.add('clickable-pivot');
      el.addEventListener('click', () => selectCustomPivot(index));
    });
  }
}

function selectCustomPivot(index) {
  // Add the selected pivot to our custom selections
  customPivotSelections[pivotSelectionStep] = index;
  pivotSelectionStep++;
  
  // Regenerate the algorithm with the new pivot
  regenerateQuickSortWithStrategy('custom');
}

function renderInteractiveQuickSortTables() {
  const step = steps[idx];
  if (!step || !run?.meta) return;
  
  const partitionTable = document.getElementById('interactivePartitionTable');
  const arrayTable = document.getElementById('interactiveArrayTable');
  
  if (partitionTable) {
    partitionTable.innerHTML = renderPartitionCallsTable(step);
  }
  
  if (arrayTable) {
    arrayTable.innerHTML = renderCurrentArrayState(step);
  }
}

function renderPartitionCallsTable(step) {
  const partitionCalls = step.partitionCalls || [];
  
  // Header explanation and tree diagram
  const headerExplanation = `
    <div class="partition-table-header">
      <p class="table-explanation">
        <strong>Each row = one partition call. Only the pivot shown is guaranteed to be in its final position. 
        Sorting is finished after all recursive calls.</strong>
      </p>
      <div class="recursion-tree-container">
        <div class="recursion-tree">
          ${renderRecursionTree(partitionCalls)}
        </div>
      </div>
    </div>
  `;
  
  if (partitionCalls.length === 0) {
    return `
      ${headerExplanation}
      <table class="note-table partition-table">
        <thead>
          <tr>
            <th>Call</th>
            <th>Subarray</th>
            <th>Pivot Value</th>
            <th>Pivot Index</th>
            <th>Left Subarray</th>
            <th>Right Subarray</th>
            <th>Array after partition</th>
          </tr>
        </thead>
        <tbody>
          <tr><td colspan="7" style="text-align: center; color: #9fb0d1;">No partition calls yet - step through the algorithm to see them</td></tr>
        </tbody>
      </table>
    `;
  }
  
  const rows = partitionCalls.map(call => {
    const arrayStr = call.arrayAfter ? `[${call.arrayAfter.join(', ')}]` : 'In progress...';
    const pivotIndex = call.pivotIndex !== null ? call.pivotIndex : '—';
    const leftSubarray = call.leftSubarray || '—';
    const rightSubarray = call.rightSubarray || '—';
    
    return `
      <tr id="call-row-${call.call}" class="partition-call-row" data-call="${call.call}">
        <td>${call.call}</td>
        <td>${call.subarray}</td>
        <td>${call.pivotValue}</td>
        <td>${pivotIndex}</td>
        <td class="subarray-cell">${leftSubarray}</td>
        <td class="subarray-cell">${rightSubarray}</td>
        <td><code>${arrayStr}</code></td>
      </tr>
    `;
  }).join('');
  
  return `
    ${headerExplanation}
    <table class="note-table partition-table">
      <thead>
        <tr>
          <th>Call</th>
          <th>Subarray</th>
          <th>Pivot Value</th>
          <th>Pivot Index</th>
          <th>Left Subarray</th>
          <th>Right Subarray</th>
          <th>Array after partition</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderRecursionTree(partitionCalls) {
  if (partitionCalls.length === 0) {
    return '<div class="tree-placeholder">Tree will appear as calls are made</div>';
  }
  
  // Get the original array from the first partition call
  const originalArray = partitionCalls.length > 0 ? (partitionCalls[0].arrayBefore ?? []) : [];
  
  // Build a tree structure from partition calls
  const treeNodes = partitionCalls.map(call => ({
    call: call.call,
    subarray: call.subarray,
    subarrayElements: call.subarrayElements || [],
    pivotValue: call.pivotValue,
    parentCall: call.parentCall,
    level: call.recursionLevel || 0,
    leftElements: call.leftElements || [],
    rightElements: call.rightElements || []
  }));
  
  // Helper function to truncate long arrays for better tree visualization
  const truncateArray = (elements, maxElements = 5) => {
    if (elements.length <= maxElements) {
      return elements.join(', ');
    }
    const shown = elements.slice(0, maxElements);
    const remaining = elements.length - maxElements;
    return `${shown.join(', ')}, ... (+${remaining})`;
  };
  
  // Create triangle tree visualization with slanted edges
  const maxLevel = Math.max(...treeNodes.map(n => n.level));
  let treeHTML = '<div class="triangle-tree-container">';
  
  // Add the original array as root node at the top
  treeHTML += `
    <div class="triangle-tree-level triangle-level-root">
      <div class="triangle-node-container root-node">
        <div class="triangle-node" data-call="root">
          <div class="node-elements">[${truncateArray(originalArray)}]</div>
          <div class="node-label">Original Array</div>
        </div>
      </div>
    </div>
  `;
  
  // Add connections from root to level 0 nodes
  const level0Nodes = treeNodes.filter(n => n.level === 0);
  if (level0Nodes.length > 0) {
    treeHTML += '<div class="tree-connections-level">';
    
    level0Nodes.forEach((node, index) => {
      // Only connect nodes that have parentCall === null (direct children of root)
      if (node.parentCall === null) {
        const childPosition = index - (level0Nodes.length - 1) / 2;
        const isLeft = index === 0;
        const connectionClass = isLeft ? 'left-connection' : 'right-connection';
        
        treeHTML += `
          <div class="tree-connection ${connectionClass}" 
               style="--parent-position: 0; --child-position: ${childPosition}">
          </div>
        `;
      }
    });
    
    treeHTML += '</div>';
  }
  
  // Build tree levels in triangle formation
  for (let level = 0; level <= maxLevel; level++) {
    const nodesAtLevel = treeNodes.filter(n => n.level === level);
    if (nodesAtLevel.length > 0) {
      treeHTML += `<div class="triangle-tree-level triangle-level-${level}">`;
      
      nodesAtLevel.forEach((node, index) => {
        // Calculate horizontal position for triangle layout
        const totalNodes = nodesAtLevel.length;
        const nodePosition = index - (totalNodes - 1) / 2; // Center around 0
        
        // Create the elements display for this node
        const elementsStr = node.subarrayElements.length > 0 ? 
          `[${truncateArray(node.subarrayElements)}]` : 
          node.subarray;
        
        treeHTML += `
          <div class="triangle-node-container" data-position="${nodePosition}" style="--node-position: ${nodePosition}">
            <div class="triangle-node" data-call="${node.call}" onclick="highlightTableRow(${node.call})">
              <div class="node-elements">${elementsStr}</div>
              <div class="node-pivot">pivot = ${node.pivotValue}</div>
            </div>
          </div>
        `;
      });
      
      treeHTML += '</div>';
      
      // Add connection lines to the next level
      if (level < maxLevel) {
        const nextLevelNodes = treeNodes.filter(n => n.level === level + 1);
        if (nextLevelNodes.length > 0) {
          treeHTML += '<div class="tree-connections-level">';
          
          // Create connections for each node at current level
          nodesAtLevel.forEach((node, index) => {
            const childNodes = nextLevelNodes.filter(n => n.parentCall === node.call);
            if (childNodes.length > 0) {
              const nodePosition = index - (nodesAtLevel.length - 1) / 2;
              
              childNodes.forEach((child, childIndex) => {
                const childNodeIndex = nextLevelNodes.indexOf(child);
                const childPosition = childNodeIndex - (nextLevelNodes.length - 1) / 2;
                
                const isLeft = childIndex === 0;
                const connectionClass = isLeft ? 'left-connection' : 'right-connection';
                
                treeHTML += `
                  <div class="tree-connection ${connectionClass}" 
                       style="--parent-position: ${nodePosition}; --child-position: ${childPosition}">
                  </div>
                `;
              });
            }
          });
          
          treeHTML += '</div>';
        }
      }
    }
  }
  
  treeHTML += '</div>';
  return treeHTML;
}

function highlightTableRow(callNumber) {
  // Remove previous highlights
  document.querySelectorAll('.partition-call-row').forEach(row => {
    row.classList.remove('highlighted');
  });
  
  // Highlight the selected row
  const targetRow = document.getElementById(`call-row-${callNumber}`);
  if (targetRow) {
    targetRow.classList.add('highlighted');
    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function renderCurrentArrayState(step) {
  const arr = step.array;
  const partitionInfo = step.partitionInfo;
  
  if (!arr || arr.length === 0) return '';
  
  // Create index headers
  const indexHeaders = arr.map((_, i) => `<th>${i}</th>`).join('');
  
  // Create current array row with appropriate styling based on partition state
  const currentArrayCells = arr.map((value, i) => {
    let cellClass = 'cell';
    
    if (partitionInfo) {
      const { action, low, high, j, pivotValue, i: partitionI } = partitionInfo;
      
      if (i === high) {
        cellClass += ' cell-pivot'; // The pivot
      } else if (action === 'compare' && i < j) {
        // Elements that have been processed
        cellClass += value <= pivotValue ? ' cell-lte' : ' cell-gt';
      } else if (action === 'compare' && i === j) {
        // Currently being compared
        cellClass += ' cell-unseen';
      } else if (i >= low && i < high) {
        // In the subarray being processed
        if (i <= partitionI) {
          cellClass += ' cell-lte';
        } else if (i > j) {
          cellClass += ' cell-unseen';
        } else {
          cellClass += ' cell-gt';
        }
      }
    }
    
    const clickable = currentPivotStrategy === 'custom' && !partitionInfo ? ' array-element-clickable' : '';
    return `<td><span class="${cellClass}${clickable}" data-index="${i}">${value}</span></td>`;
  }).join('');
  
  let description = 'Initial array';
  if (partitionInfo) {
    const { action, low, high, j, pivotValue } = partitionInfo;
    if (action === 'start-partition') {
      description = `Starting partition of [${low}, ${high}] with pivot = ${pivotValue}`;
    } else if (action === 'compare') {
      description = `Comparing A[${j}] = ${arr[j]} with pivot = ${pivotValue}`;
    } else if (action === 'final-swap') {
      description = `Final swap - pivot in correct position`;
    }
  }
  
  return `
    <table class="note-table note-array-table">
      <thead>
        <tr>
          <th scope="row">Index</th>
          ${indexHeaders}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">${description}</th>
          ${currentArrayCells}
        </tr>
      </tbody>
    </table>
  `;
}

function renderAnalysis(model) {
  if (!analysisBody) return;
  if (!model || !Array.isArray(model.rows) || model.rows.length === 0) {
    analysisBody.innerHTML = '';
    if (analysisFoot) analysisFoot.innerHTML = '';
    if (analysisControls) analysisControls.style.display = 'none';
    analysisLastHL = null;
    return;
  }
  const flashIndex = (typeof model.hlIndex === 'number' && model.hlIndex !== analysisLastHL) ? model.hlIndex : null;
  analysisBody.innerHTML = model.rows
    .map((r, i) => {
      const cls = (i === model.hlIndex ? ('hl' + (i === flashIndex ? ' flash' : '')) : '');
      return `<tr class="${cls}"><td>${r.level}</td><td>${r.arg}</td><td>${r.tc1}</td><td>${r.nodes}</td><td>${r.levelTC}</td></tr>`;
    })
    .join('');
  if (analysisFoot) {
    const totalSym = model.totalSym ?? model.total ?? '';
    const totalNum = model.totalNum ?? '';
    const both = totalNum && totalSym && totalNum !== totalSym;
    const totalCell = both ? `<div>${totalSym}</div><div>${totalNum}</div>` : (totalNum || totalSym);
    analysisFoot.innerHTML = `<tr><td colspan="4">Total</td><td>${totalCell}</td></tr>`;
  }
  if (analysisControls) analysisControls.style.display = model.showControls ? 'flex' : 'none';
  analysisLastHL = typeof model.hlIndex === 'number' ? model.hlIndex : null;
}

// Helpers to assess input order
function isSortedNonDecreasing(a){
  for (let i=1;i<a.length;i++){ if (a[i] < a[i-1]) return false; } return true;
}
function isSortedNonIncreasing(a){
  for (let i=1;i<a.length;i++){ if (a[i] > a[i-1]) return false; } return true;
}

// Map algorithm to asymptotic Big O string based on current inputs/steps
function bigOFor(type, algoKey, options = {}) {
  const steps = options.steps || [];
  const arr0 = Array.isArray(options.arr) ? options.arr : (steps?.[0]?.array ?? []);
  if (type === 'sorting') {
    switch (algoKey) {
      case 'mergeSort':
        return 'O(n log n)';
      case 'quickSort': {
        // With last-element pivot, monotonic arrays are worst-case
        if (isSortedNonDecreasing(arr0) || isSortedNonIncreasing(arr0)) return 'O(n^2)';
        // Otherwise assume average balanced partitions
        return 'O(n log n)';
      }
      case 'insertionSort': {
        if (isSortedNonDecreasing(arr0)) return 'O(n)';
        if (isSortedNonIncreasing(arr0)) return 'O(n^2)';
        return 'O(n^2)';
      }
      case 'bubbleSort': {
        // Best when no swaps occurred
        const anySwap = steps.some(s => Array.isArray(s.swap) && s.swap.length > 0);
        return anySwap ? 'O(n^2)' : 'O(n)';
      }
      case 'selectionSort':
        return 'O(n^2)';
      default:
        return '';
    }
  } else if (type === 'searching') {
    const target = options.target;
    switch (algoKey) {
      case 'binarySearch': {
        const sorted = [...arr0].sort((a,b)=>a-b);
        const midIdx = Math.floor((sorted.length - 1) / 2);
        if (sorted.length > 0 && target === sorted[midIdx]) return 'O(1)';
        return 'O(log n)';
      }
      case 'linearSearch': {
        if (arr0.length === 0) return 'O(1)';
        if (arr0[0] === target) return 'O(1)';
        // Otherwise, may be anywhere or not found
        return 'O(n)';
      }
      default:
        return '';
    }
  }
  return '';
}

// Show/hide the final Big O banner at the end of a run
function updateAnalysisSummaryAtEnd() {
  if (!analysisSummary || !analysisBigO) return;
  const currentType = algoType.value;
  // Trees: hide banner; table is informative only
  if (currentType === 'trees') {
    analysisSummary.classList.remove('is-visible');
    analysisSummary.style.display = 'none';
    return;
  }
  const total = steps?.length || 0;
  const atEnd = total > 0 && idx >= total - 1;
  if (!atEnd) {
    analysisSummary.classList.remove('is-visible');
    // keep display none to remove from flow
    analysisSummary.style.display = 'none';
    return;
  }
  const algoKey = algoSelect.value;
  const mode = (currentType === 'sorting' && algoKey === 'quickSort') ? (analysisModeSel?.value || 'avg') : undefined;
  // Determine current input state
  const arrNow = parseArray(arrayInput.value);
  const targetVal = parseInt(searchTarget.value);
  const bigO = bigOFor(currentType, algoKey, { mode, steps, arr: arrNow, target: targetVal });
  if (bigO) {
    analysisBigO.textContent = bigO.startsWith('O(') ? bigO : `O(${bigO})`;
    // make sure it's in the flow, then animate in
    analysisSummary.style.display = 'flex';
    // next frame to ensure transition triggers
    requestAnimationFrame(() => analysisSummary.classList.add('is-visible'));
  } else {
    analysisSummary.classList.remove('is-visible');
    analysisSummary.style.display = 'none';
  }
}

// --- Analysis builders ---
function fmt(expr){ return String(expr).replace(/\*\*/g,'^'); }

function clipLongTableWithEllipsis(rows, maxRows) {
  const head = rows.slice(0, 4);
  const tail = rows.slice(-2);
  const ellipsis = { level: '…', arg: '…', tc1: '…', nodes: '…', levelTC: '…' };
  rows.splice(0, rows.length, ...head, ellipsis, ...tail);
}

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
    const denom = Math.pow(2, level);
    const argSym = level === 0 ? 'n' : `n/${denom}`;
    const arg = numeric ? `${Math.max(1, Math.round(n/Math.pow(2,level)))}` : argSym;
    const nodes = numeric ? `${Math.pow(2,level)}` : `2^${level}`;
    const tc1 = plusCN
      ? (numeric ? `${cval}·${Math.max(1, Math.round(n/Math.pow(2,level)))}` : `c·${argSym}`)
      : (numeric ? `${cval}` : `c`);
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
    clipLongTableWithEllipsis(rows, maxRows);
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
  return { rows, total, hlIndex: rows.length ? rows.length - 1 : null };
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
  return { rows, total, hlIndex: rows.length ? rows.length - 1 : null };
}

function analysisSimpleSort(step, n) {
  if (!step) return { rows: [] };
  const rows = [ { level: idx + 1, arg: `n=${n}`, tc1: 'c', nodes: 1, levelTC: 'c' } ];
  return { rows, total: `${idx + 1}·c`, hlIndex: 0 };
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
  
  // Render interactive quicksort tables if applicable
  if (algoType.value === 'sorting' && algoSelect.value === 'quickSort') {
    renderInteractiveQuickSortTables();
  }
  
  // Update final Big O banner visibility/value
  updateAnalysisSummaryAtEnd();
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

// Inputs panel toggle
if (inputsToggle && inputsBody) {
  inputsToggle.onclick = () => {
    const willCollapse = !inputsBody.classList.contains('collapsed');
  inputsBody.classList.toggle('collapsed', willCollapse);
  inputsToggle.setAttribute('aria-expanded', willCollapse ? 'false' : 'true');
  inputsToggle.textContent = willCollapse ? '›' : '⌄';
    try { localStorage.setItem(LS_KEYS.inputsCollapsed, willCollapse ? '1' : '0'); } catch {}
    if (miniToolbar) miniToolbar.style.display = willCollapse ? 'flex' : 'none';
  if (inputsPanel) inputsPanel.classList.toggle('is-collapsed', willCollapse);
  if (inputsHint) inputsHint.style.visibility = willCollapse ? 'visible' : 'hidden';
    // Auto-focus primary input when expanding on mobile
    if (!willCollapse) {
      setTimeout(() => {
        const t = algoType.value;
        if (t === 'sorting') arrayInput?.focus();
        else if (t === 'searching') searchTarget?.focus();
        else if (t === 'trees') bstValue?.focus();
      }, 50);
    }
  };
}
if (sortedToggle) {
  sortedToggle.onchange = () => { try { localStorage.setItem(LS_KEYS.sortedAfterRandom, sortedToggle.checked ? '1' : '0'); } catch {} };
}
if (arraySizeInput) {
  arraySizeInput.onchange = () => {
    let v = parseInt(arraySizeInput.value);
    if (!Number.isFinite(v)) v = 10;
    v = Math.max(3, Math.min(50, v));
    arraySizeInput.value = String(v);
    try { localStorage.setItem(LS_KEYS.randomSize, String(v)); } catch {}
  };
}

if (hapticsToggle) {
  hapticsToggle.onchange = () => { try { localStorage.setItem(LS_KEYS.haptics, hapticsToggle.checked ? '1' : '0'); } catch {} };
}
if (bstFitToggle) {
  bstFitToggle.onchange = () => {
    try { localStorage.setItem(LS_KEYS.bstFit, bstFitToggle.checked ? '1' : '0'); } catch {}
    try { localStorage.setItem(LS_KEYS.bstFitUserSet, '1'); } catch {}
    if (algoType.value === 'trees') renderBSTStep();
  };
}
if (bstResetBtn) {
  bstResetBtn.onclick = () => {
    try {
      localStorage.setItem(LS_KEYS.bstFit, '1');
      localStorage.setItem(LS_KEYS.bstFitUserSet, '0');
    } catch {}
    if (bstFitToggle) bstFitToggle.checked = true;
    if (algoType.value === 'trees') renderBSTStep();
  };
}

// Auto-enable Fit on rotation into portrait if user hasn't explicitly set it
function maybeAutoEnableFit() {
  try {
    if (!bstFitToggle) return;
    const userSet = localStorage.getItem(LS_KEYS.bstFitUserSet) === '1';
    if (userSet) return;
    const isPortrait = window.matchMedia && window.matchMedia('(orientation: portrait)').matches;
    const isNarrow = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if ((isPortrait || isNarrow) && !bstFitToggle.checked) {
      bstFitToggle.checked = true;
      localStorage.setItem(LS_KEYS.bstFit, '1');
      if (algoType.value === 'trees') renderBSTStep();
    }
  } catch {}
}

try {
  const mql = window.matchMedia && window.matchMedia('(orientation: portrait)');
  if (mql && mql.addEventListener) {
    mql.addEventListener('change', (e) => { if (e.matches) maybeAutoEnableFit(); });
  } else {
    window.addEventListener('resize', () => {
      const isPortrait = window.matchMedia && window.matchMedia('(orientation: portrait)').matches;
      if (isPortrait) maybeAutoEnableFit();
    });
  }
} catch {}

// Haptic feedback utility
function haptic(type = 'tap') {
  try {
    if (!hapticsToggle?.checked) return;
    if (!('vibrate' in navigator)) return;
    const patterns = {
      tap: 15,
      tick: 8,
      success: [18, 24, 18],
      error: [30, 45, 30],
      long: 60,
    };
    navigator.vibrate(patterns[type] ?? patterns.tap);
  } catch {}
}

if (resetBtn) {
  resetBtn.onclick = () => {
    try {
      // Clear persisted UI/analysis preferences
      Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
    } catch {}
    // Restore defaults
    if (inputsBody && inputsToggle) {
  inputsBody.classList.remove('collapsed');
  inputsToggle.setAttribute('aria-expanded','true');
  inputsToggle.textContent = '⌄';
    }
    if (inputsPanel) inputsPanel.classList.remove('is-collapsed');
    if (sortedToggle) sortedToggle.checked = false;
    if (arraySizeInput) arraySizeInput.value = '10';
    if (analysisNumeric) analysisNumeric.checked = false;
    if (analysisC) analysisC.value = '8';
    if (analysisModeSel) analysisModeSel.value = 'avg';
    // Reset algorithm type and selection
    algoType.value = 'sorting';
    populateAlgorithmSelect();
    // Reset array and target
    arrayInput.value = '5,2,9,1,5,6';
    searchTarget.value = '5';
    // Rebuild steps
    const arr = parseArray(arrayInput.value);
    buildSteps(algoSelect.value, arr, parseInt(searchTarget.value));
    renderCurrentStep();
  };
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
    
    // For quicksort, pass options for pivot strategy
    if (currentType === 'sorting' && algoKey === 'quickSort') {
      const options = { 
        pivotStrategy: currentPivotStrategy,
        customPivots: currentPivotStrategy === 'custom' ? customPivotSelections : []
      };
      run = algo(arr, options);
    } else {
      run = currentType === 'searching' ? algo(arr, target) : algo(arr);
    }
    
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
  playBtn.setAttribute('aria-pressed','false');
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
  try { localStorage.setItem(LS_KEYS.algoType, algoType.value); } catch {}
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
  // Focus relevant field on type change
  setTimeout(() => {
    const t = algoType.value;
    if (t === 'sorting') arrayInput?.focus();
    else if (t === 'searching') searchTarget?.focus();
    else if (t === 'trees') bstValue?.focus();
  }, 50);
};

algoSelect.onchange = () => {
  try {
    const t = algoType.value;
    const keyName = t === 'sorting' ? LS_KEYS.algo_sorting : (t === 'searching' ? LS_KEYS.algo_searching : LS_KEYS.algo_trees);
    localStorage.setItem(keyName, algoSelect.value);
  } catch {}
  const arr = parseArray(arrayInput.value);
  const target = parseInt(searchTarget.value);
  stopPlaying();
  buildSteps(algoSelect.value, arr, target);
};

randomBtn.onclick = () => {
  const n = Math.max(3, Math.min(50, parseInt(arraySizeInput?.value) || 10));
  const arr = randomArray(n);
  const makeSorted = !!sortedToggle?.checked;
  const finalArr = makeSorted ? [...arr].sort((a,b)=>a-b) : arr;
  arrayInput.value = finalArr.join(', ');
  const target = parseInt(searchTarget.value) || arr[Math.floor(Math.random() * arr.length)];
  searchTarget.value = target;
  stopPlaying();
  buildSteps(algoSelect.value, finalArr, target);
  haptic('tick');
};

loadBtn.onclick = () => {
  const arr = parseArray(arrayInput.value);
  if (arr.length === 0) {
  haptic('tick');
    alert('Please enter numbers (comma-separated).');
    return;
  }
  const target = parseInt(searchTarget.value);
  haptic('tick');
  stopPlaying();
  buildSteps(algoSelect.value, arr, target);
};

searchTarget.onchange = () => {
  const arr = parseArray(arrayInput.value);
  const target = parseInt(searchTarget.value);
  stopPlaying();
  haptic('tick');
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
  haptic('tick');
};

bstSearchBtn.onclick = () => {
  ensureBSTInitialized();
  const v = Number(bstValue.value);
  if (!Number.isFinite(v)) return;
  const before = bstSession.steps.length;
  bstSession.api.search(v);
  idx = before;
  renderBSTStep();
  haptic('tick');
};

bstClearBtn.onclick = () => {
  // Reset to a fresh empty BST session
  bstSession = createBST([]);
  idx = 0;
  renderBSTStep();
  haptic('long');
};

firstBtn.onclick = () => {
  stopPlaying();
  setStep(0);
  haptic('tick');
};
prevBtn.onclick = () => {
  stopPlaying();
  setStep(idx - 1);
  haptic('tick');
};
nextBtn.onclick = () => {
  stopPlaying();
  setStep(idx + 1);
  haptic('tick');
};
lastBtn.onclick = () => {
  stopPlaying();
  const currentType = algoType.value;
  const total = currentType === 'trees' ? (bstSession?.steps?.length || 0) : steps.length;
  setStep(total - 1);
  haptic('tick');
};

playBtn.onclick = () => {
  const currentType = algoType.value;
  const total = currentType === 'trees' ? (bstSession?.steps?.length || 0) : steps.length;
  if (total <= 1) return;
  playing = !playing;
  playBtn.textContent = playing ? '⏸ Pause' : '▶ Play';
  playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  if (playing) {
    playLoop();
  } else {
    stopPlaying();
  }
  haptic('tick');
};

// Boot: restore algo type and selection
try {
  const savedType = localStorage.getItem(LS_KEYS.algoType);
  if (savedType && ['sorting','searching','trees'].includes(savedType)) {
    algoType.value = savedType;
  }
} catch {}
populateAlgorithmSelect();
// select saved algorithm for current type if available (populateAlgorithmSelect also tries)
const currentType = algoType.value;
try {
  const keyName = currentType === 'sorting' ? LS_KEYS.algo_sorting : (currentType === 'searching' ? LS_KEYS.algo_searching : LS_KEYS.algo_trees);
  const savedAlgo = localStorage.getItem(keyName);
  if (savedAlgo) { algoSelect.value = savedAlgo; }
} catch {}
const defaultAlgo = algoSelect.value || Object.keys(sortingAlgorithms)[0];
const initialArr = parseArray(arrayInput.value);
const initialTarget = parseInt(searchTarget.value);
buildSteps(defaultAlgo, initialArr, initialTarget);

// Mini toolbar wiring (reuse existing handlers)
if (miniRandom) miniRandom.onclick = () => { randomBtn.click(); };
if (miniLoad) miniLoad.onclick = () => { loadBtn.click(); };
if (miniPlay) miniPlay.onclick = () => { playBtn.click(); };

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
