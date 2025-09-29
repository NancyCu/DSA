// Quick Sort with step generator + pseudocode mapping (ES module)
export function quickSort(input, options = {}) {
  const arr = [...input];
  const steps = [];
  const partitionCalls = []; // Track all partition calls
  let callCounter = 0;
  const { pivotStrategy = 'last', customPivots = [] } = options;
  
  const pseudocode = [
    'quickSort(A, low, high)',
    '    if low < high',
    '        pivot ← partition(A, low, high)',
    '        quickSort(A, low, pivot-1)',
    '        quickSort(A, pivot+1, high)',
    'partition(A, low, high)',
    '    pivotValue ← A[high]',
    '    i ← low - 1',
    '    for j ← low to high-1',
    '        if A[j] ≤ pivotValue',
    '            i ← i + 1',
    '            swap A[i], A[j]',
    '    swap A[i+1], A[high]',
    '    return i + 1'
  ];

  const meta = {
    complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' },
    space: 'O(log n)',
    notes: `
      <div class="note-section">
        <h3>Interactive Partition Walk-through</h3>
        <p>
          Using the Lomuto scheme with a chosen pivot element, every call to
          <code>partition(A, start, end)</code> moves that pivot into its final sorted position.
          The table below updates as the algorithm progresses and shows the pivot index returned.
        </p>
        <div class="pivot-controls">
          <label for="pivotStrategy">Pivot Strategy:</label>
          <select id="pivotStrategy">
            <option value="last">Rightmost Element (Default)</option>
            <option value="first">Leftmost Element</option>
            <option value="median-of-three">Median of Three</option>
            <option value="random">Random</option>
            <option value="custom">Custom (Click Array Elements)</option>
          </select>
          <button id="resetPivots">Reset Pivots</button>
        </div>
        <div id="customPivotInfo" style="display: none;">
          <p><strong>Custom Mode:</strong> Click on array elements to choose pivots for each partition call.</p>
        </div>
        <div id="interactivePartitionTable">
          <!-- Dynamic table will be inserted here -->
        </div>
        <div class="note-array-legend">
          <span class="cell-label"><span class="cell-swatch cell-lte">≤ pivot</span> moved left</span>
          <span class="cell-label"><span class="cell-swatch cell-gt">&gt; pivot</span> stays right</span>
          <span class="cell-label"><span class="cell-swatch cell-unseen">unprocessed</span> pending scan</span>
          <span class="cell-label"><span class="cell-swatch cell-pivot">pivot</span> chosen element</span>
        </div>
        <div id="interactiveArrayTable">
          <!-- Dynamic array visualization will be inserted here -->
        </div>
        <p class="note-footnote">The table updates in real-time as you step through the algorithm. Choose different pivot strategies or click elements in custom mode to see how pivot selection affects partitioning.</p>
      </div>
      <div class="note-section">
        <h3>Pivot improvements &amp; variations</h3>
        <ul>
          <li><strong>Median-of-three:</strong> choose the median of <code>A[low]</code>, <code>A[mid]</code>, <code>A[high]</code> and swap it into <code>A[high]</code>. This guards against already sorted inputs that trigger the quadratic worst case.</li>
          <li><strong>Random pivot:</strong> pick a random index in <code>[low, high]</code> before partitioning. Expected runtime stays at <code>O(n log n)</code> even for adversarial input.</li>
          <li><strong>Tail call elimination:</strong> always recurse on the smaller side first and loop over the larger side to keep the call stack at <code>O(log n)</code>.</li>
          <li><strong>Insertion sort cutoff:</strong> for tiny subarrays (e.g., ≤ 8 elements) switch to insertion sort to cut the constant factors.</li>
        </ul>
        <p>With balanced partitions, the Master Theorem gives <code>T(n) = 2T(n/2) + Θ(n) = Θ(n log n)</code>. Unbalanced partitions (<code>T(n) = T(n-1) + Θ(n)</code>) degrade to <code>Θ(n²)</code>.</p>
      </div>
      <div class="note-section">
        <h3>Median-of-three in practice</h3>
        <p>The table shows the first call on the same array when the pivot is chosen via median-of-three.</p>
        <table class="note-table">
          <thead>
            <tr><th>low</th><th>mid</th><th>high</th><th>Values</th><th>Median</th></tr>
          </thead>
          <tbody>
            <tr><td>0</td><td>4</td><td>9</td><td><code>[27, 45, 30]</code></td><td><code>30</code> → swapped into <code>A[high]</code></td></tr>
          </tbody>
        </table>
        <p>Subsequent partitioning mirrors the Lomuto flow but avoids the degenerate pivot for sorted or reverse-sorted inputs.</p>
      </div>
      <div class="note-section">
        <h3>Properties</h3>
        <ul>
          <li>Not stable – equal keys can swap their relative order.</li>
          <li>In-place – only uses <code>O(log n)</code> extra stack frames on average.</li>
          <li><strong>Quickselect:</strong> reuse <code>partition</code> but recurse only into the side that contains the k-th element. Average case <code>Θ(n)</code>, worst case <code>Θ(n²)</code>.</li>
        </ul>
      </div>
      <div class="note-section">
        <h3>Quickselect pseudocode</h3>
        <pre><code>QuickSelect(A, k, start, end)
    if start == end: return A[start]
    pivotIndex ← partition(A, start, end)
    if pivotIndex == k: return A[k]
    if pivotIndex &gt; k: return QuickSelect(A, k, start, pivotIndex-1)
    return QuickSelect(A, k, pivotIndex+1, end)</code></pre>
      </div>
      <div class="note-section">
        <h3>Practice prompts</h3>
        <ul>
          <li>Trace the swap operations for two crafted inputs: one where every element is smaller than the pivot and one where every element is larger.</li>
          <li>Experiment with the cutoff for switching to insertion sort – how does it affect comparisons on random arrays?</li>
          <li>Implement median-of-three and random pivot variants, then compare recursion depth statistics.</li>
        </ul>
      </div>
      <div class="note-section">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://visualgo.net/en/sorting" target="_blank" rel="noopener">VisuAlgo quicksort animation</a> – demonstrates different partition strategies.</li>
          <li><a href="https://visualgo.net/en" target="_blank" rel="noopener">VisuAlgo (full site)</a> – interactive DSA reference.</li>
          <li><a href="https://www.youtube.com/watch?v=PgBzjlCcFvg" target="_blank" rel="noopener">mycodeschool quicksort deep dive</a>.</li>
          <li><a href="https://en.wikipedia.org/wiki/Quicksort" target="_blank" rel="noopener">Wikipedia overview</a> – historical context and proofs.</li>
        </ul>
      </div>
    `.trim()
  };

  function push(sel = [], compare = [], swap = [], hlLines = [1], seg = null, partitionInfo = null) {
    const snapshot = { array: [...arr], sel, compare, swap, hlLines };
    if (seg) snapshot.segment = seg; // {low, high}
    if (partitionInfo) snapshot.partitionInfo = partitionInfo;
    snapshot.partitionCalls = [...partitionCalls]; // Include current partition call state
    steps.push(snapshot);
  }

  push([], [], [], [1]);

  // Helper functions for recursion tree tracking
  function getRecursionLevel(low, high) {
    // Calculate depth based on subarray size
    const size = high - low + 1;
    const totalSize = arr.length;
    return Math.floor(Math.log2(totalSize / size));
  }

  function getParentCall(low, high) {
    // Find the parent call that would have created this subarray
    for (let i = partitionCalls.length - 1; i >= 0; i--) {
      const call = partitionCalls[i];
      if (call.pivotIndex !== null) {
        // Check if this subarray could be left child
        if (call.pivotIndex - 1 >= low && call.low <= low && high <= call.pivotIndex - 1) {
          return call.call;
        }
        // Check if this subarray could be right child
        if (call.pivotIndex + 1 <= high && call.pivotIndex + 1 <= low && high <= call.high) {
          return call.call;
        }
      }
    }
    return null; // Root call
  }

  function choosePivot(low, high, callNumber) {
    if (customPivots[callNumber] !== undefined) {
      return Math.max(low, Math.min(high, customPivots[callNumber]));
    }
    
    switch (pivotStrategy) {
      case 'first':
        return low;
      case 'random':
        return low + Math.floor(Math.random() * (high - low + 1));
      case 'median-of-three':
        const mid = Math.floor((low + high) / 2);
        const vals = [
          { idx: low, val: arr[low] },
          { idx: mid, val: arr[mid] },
          { idx: high, val: arr[high] }
        ];
        vals.sort((a, b) => a.val - b.val);
        return vals[1].idx;
      case 'last':
      default:
        return high;
    }
  }

  function partition(low, high) {
    const pivotIdx = choosePivot(low, high, callCounter);
    
    // Swap pivot to end if not already there
    if (pivotIdx !== high) {
      [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];
      push([pivotIdx, high], [], [pivotIdx, high], [6], { low, high }, 
           { action: 'pivot-swap', pivotIdx, high });
    }
    
    const pivotValue = arr[high];
    let i = low - 1;
    
    // Record this partition call
    const partitionCall = {
      call: callCounter + 1,
      subarray: `[${low}, ${high}]`,
      pivotIndex: null, // Will be set after partitioning
      arrayBefore: [...arr],
      arrayAfter: null, // Will be set after partitioning
      low,
      high,
      pivotValue
    };
    
    push([high], [], [], [6, 7], { low, high }, 
         { action: 'start-partition', pivotValue, low, high });
    
    for (let j = low; j < high; j++) {
      push([low, high, i + 1], [j, high], [], [8, 9, 10], { low, high },
           { action: 'compare', j, pivotValue, comparison: arr[j] <= pivotValue });
      if (arr[j] <= pivotValue) {
        i++;
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        push([i], [], [i, j], [11, 12], { low, high },
             { action: 'swap', i, j });
      }
    }
    
    const finalPivotPos = i + 1;
    const tmp = arr[finalPivotPos];
    arr[finalPivotPos] = arr[high];
    arr[high] = tmp;
    
    // Complete the partition call record
    partitionCall.pivotIndex = finalPivotPos;
    partitionCall.arrayAfter = [...arr];
    
    // Add subarray information with actual elements
    const leftSubarray = finalPivotPos > low ? 
      arr.slice(low, finalPivotPos).map(x => x.toString()).join(', ') : 'none';
    const rightSubarray = finalPivotPos < high ? 
      arr.slice(finalPivotPos + 1, high + 1).map(x => x.toString()).join(', ') : 'none';
    
    partitionCall.leftSubarray = leftSubarray === 'none' ? leftSubarray : `[${leftSubarray}]`;
    partitionCall.rightSubarray = rightSubarray === 'none' ? rightSubarray : `[${rightSubarray}]`;
    
    // Also store raw element arrays for tree visualization
    partitionCall.leftElements = finalPivotPos > low ? arr.slice(low, finalPivotPos) : [];
    partitionCall.rightElements = finalPivotPos < high ? arr.slice(finalPivotPos + 1, high + 1) : [];
    partitionCall.subarrayElements = arr.slice(low, high + 1);
    
    // Add recursion tree node information
    partitionCall.recursionLevel = getRecursionLevel(low, high);
    partitionCall.parentCall = getParentCall(low, high);
    
    partitionCalls.push(partitionCall);
    callCounter++;
    
    push([finalPivotPos], [], [finalPivotPos, high], [13], { low, high },
         { action: 'final-swap', pivotPos: finalPivotPos });
    
    return finalPivotPos;
  }

  function sort(low, high) {
    if (low < high) {
      push([low, high], [], [], [1, 2], { low, high });
      const pivot = partition(low, high);
      push([pivot], [], [], [3], { low, high });
      sort(low, pivot - 1);
      sort(pivot + 1, high);
    } else if (low === high) {
      push([low], [], [], [1], { low, high });
    }
  }

  if (arr.length > 0) {
    sort(0, arr.length - 1);
  }

  return { steps, pseudocode, meta: { ...meta, partitionCalls, pivotStrategy } };
}