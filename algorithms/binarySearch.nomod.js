// Binary Search with step generator + pseudocode mapping (non-module build)
(function (global) {
  function binarySearch(input) {
    if (
      !input ||
      !Array.isArray(input.array) ||
      typeof input.target !== 'number'
    ) {
      throw new Error('binarySearch expects { array: number[], target: number }');
    }
    const { array: source, target } = input;
    const arr = [...source];
    const steps = [];
    const pseudocode = [
      'low \u2190 0',
      'high \u2190 n - 1',
      'while low \u2264 high',
      '    mid \u2190 \u230a(low + high) / 2\u230b',
      '    if A[mid] = target return mid',
      '    else if A[mid] < target',
      '        low \u2190 mid + 1',
      '    else',
      '        high \u2190 mid - 1',
      'return -1'
    ];

    const meta = {
      complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' },
      space: 'O(1)',
      notes: 'Requires a sorted array. Returns the index of the target or -1 if not found.'
    };

    function push(sel = [], compare = [], swap = [], hlLines = [1], extra = {}) {
      steps.push({ array: [...arr], sel, compare, swap, hlLines, ...extra });
    }

    let low = 0;
    let high = arr.length - 1;
    let foundIndex = -1;

    push([], [], [], [1, 2], { low, high });

    while (low <= high) {
      push([], [], [], [3]);
      const mid = Math.floor((low + high) / 2);
      push([mid], [], [], [4], { low, high, mid });
      if (arr[mid] === target) {
        foundIndex = mid;
        push([mid], [], [], [5], { low, high, mid, result: mid });
        break;
      } else if (arr[mid] < target) {
        low = mid + 1;
        push([], [], [], [6, 7], { low, high, mid });
      } else {
        high = mid - 1;
        push([], [], [], [8, 9], { low, high, mid });
      }
    }

    if (foundIndex === -1) {
      push([], [], [], [10], { result: -1 });
    }

    return { steps, pseudocode, meta };
  }

  global.VisuDSA = global.VisuDSA || {};
  global.VisuDSA.algorithms = global.VisuDSA.algorithms || {};
  global.VisuDSA.algorithms.binarySearch = binarySearch;
})(typeof window !== 'undefined' ? window : globalThis);
