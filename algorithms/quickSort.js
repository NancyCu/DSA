// Quick Sort with step generator + pseudocode mapping (ES module)
export function quickSort(input) {
  const arr = [...input];
  const steps = [];
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
        <h3>Partition walk-through</h3>
        <p>
          Using the Lomuto scheme with the <em>last</em> element as the pivot, every call to
          <code>partition(A, start, end)</code> moves that pivot into its final sorted position.
          The example below shows the pivot index returned for <code>[27, 90, 2, 40, 45, 80, 10, 70, 85, 30]</code>.
        </p>
        <table class="note-table">
          <thead>
            <tr><th>Call</th><th>Subarray</th><th>Pivot index</th><th>Array after partition</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>[0, 9]</td><td>3</td><td><code>[27, 2, 10, 30, 45, 80, 90, 70, 85, 40]</code></td></tr>
            <tr><td>2</td><td>[0, 2]</td><td>1</td><td><code>[2, 10, 27, 30, 45, 80, 90, 70, 85, 40]</code></td></tr>
            <tr><td>3</td><td>[4, 9]</td><td>4</td><td><code>[2, 10, 27, 30, 40, 80, 90, 70, 85, 45]</code></td></tr>
            <tr><td>4</td><td>[5, 9]</td><td>5</td><td><code>[2, 10, 27, 30, 40, 45, 90, 70, 85, 80]</code></td></tr>
            <tr><td>5</td><td>[6, 9]</td><td>7</td><td><code>[2, 10, 27, 30, 40, 45, 70, 80, 85, 90]</code></td></tr>
            <tr><td>6</td><td>[8, 9]</td><td>9</td><td><code>[2, 10, 27, 30, 40, 45, 70, 80, 85, 90]</code></td></tr>
          </tbody>
        </table>
        <div class="note-array-legend">
          <span class="cell-label"><span class="cell-swatch cell-lte">≤ pivot</span> moved left</span>
          <span class="cell-label"><span class="cell-swatch cell-gt">&gt; pivot</span> stays right</span>
          <span class="cell-label"><span class="cell-swatch cell-unseen">unprocessed</span> pending scan</span>
          <span class="cell-label"><span class="cell-swatch cell-pivot">pivot</span> last element</span>
        </div>
        <table class="note-table note-array-table">
          <thead>
            <tr>
              <th scope="row">Index</th>
              <th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">During scan (j = 3)</th>
              <td><span class="cell cell-lte">27</span></td>
              <td><span class="cell cell-gt">90</span></td>
              <td><span class="cell cell-lte">2</span></td>
              <td><span class="cell cell-gt">40</span></td>
              <td><span class="cell cell-unseen">45</span></td>
              <td><span class="cell cell-unseen">80</span></td>
              <td><span class="cell cell-unseen">10</span></td>
              <td><span class="cell cell-unseen">70</span></td>
              <td><span class="cell cell-unseen">85</span></td>
              <td><span class="cell cell-pivot">30</span></td>
            </tr>
            <tr>
              <th scope="row">After partition</th>
              <td><span class="cell cell-lte">27</span></td>
              <td><span class="cell cell-lte">2</span></td>
              <td><span class="cell cell-lte">10</span></td>
              <td><span class="cell cell-pivot">30</span></td>
              <td><span class="cell cell-gt">45</span></td>
              <td><span class="cell cell-gt">80</span></td>
              <td><span class="cell cell-gt">90</span></td>
              <td><span class="cell cell-gt">70</span></td>
              <td><span class="cell cell-gt">85</span></td>
              <td><span class="cell cell-gt">40</span></td>
            </tr>
          </tbody>
        </table>
        <p class="note-footnote">Trace the scan row from left to right: each comparison either paints the slot green (≤ pivot) or leaves it red (> pivot). Once <code>j</code> reaches the end, the pivot trades places with the first red item, yielding the lower/upper partitions shown underneath.</p>
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

  function push(sel = [], compare = [], swap = [], hlLines = [1], seg = null) {
    const snapshot = { array: [...arr], sel, compare, swap, hlLines };
    if (seg) snapshot.segment = seg; // {low, high}
    steps.push(snapshot);
  }

  push([], [], [], [1]);

  function partition(low, high) {
    const pivotValue = arr[high];
    let i = low - 1;
    push([high], [], [], [6, 7], { low, high });
    for (let j = low; j < high; j++) {
      push([low, high, i + 1], [j, high], [], [8, 9, 10], { low, high });
      if (arr[j] <= pivotValue) {
        i++;
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
        push([i], [], [i, j], [11, 12], { low, high });
      }
    }
    const tmp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = tmp;
    push([i + 1], [], [i + 1, high], [13], { low, high });
    return i + 1;
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

  return { steps, pseudocode, meta };
}