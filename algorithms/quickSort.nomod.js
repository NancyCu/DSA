// Quick Sort with step generator + pseudocode mapping (non-module build)
(function (global) {
  function quickSort(input) {
    const arr = [...input];
    const steps = [];
    const pseudocode = [
      'quickSort(A, low, high)',
      '    if low < high',
      '        pivot \u2190 partition(A, low, high)',
      '        quickSort(A, low, pivot-1)',
      '        quickSort(A, pivot+1, high)',
      'partition(A, low, high)',
      '    pivotValue \u2190 A[high]',
      '    i \u2190 low - 1',
      '    for j \u2190 low to high-1',
      '        if A[j] \u2264 pivotValue',
      '            i \u2190 i + 1',
      '            swap A[i], A[j]',
      '    swap A[i+1], A[high]',
      '    return i + 1'
    ];

    const meta = {
      complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n^2)' },
      space: 'O(log n)',
      notes: 'In-place, unstable. Worst case occurs on already sorted input with poor pivot choice.'
    };

    function push(sel = [], compare = [], swap = [], hlLines = [1]) {
      steps.push({ array: [...arr], sel, compare, swap, hlLines });
    }

    push([], [], [], [1]);

    function partition(low, high) {
      const pivotValue = arr[high];
      let i = low - 1;
      push([high], [], [], [6, 7]);
      for (let j = low; j < high; j++) {
        push([low, high, i + 1], [j, high], [], [8, 9, 10]);
        if (arr[j] <= pivotValue) {
          i++;
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
          push([i], [], [i, j], [11, 12]);
        }
      }
      const tmp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = tmp;
      push([i + 1], [], [i + 1, high], [13]);
      return i + 1;
    }

    function sort(low, high) {
      if (low < high) {
        push(Array.from({ length: high - low + 1 }, (_, idx) => low + idx), [], [], [1, 2]);
        const pivot = partition(low, high);
        push([pivot], [], [], [3]);
        sort(low, pivot - 1);
        sort(pivot + 1, high);
      } else if (low === high) {
        push([low], [], [], [1]);
      }
    }

    if (arr.length > 0) {
      sort(0, arr.length - 1);
    }

    return { steps, pseudocode, meta };
  }

  global.VisuDSA = global.VisuDSA || {};
  global.VisuDSA.algorithms = global.VisuDSA.algorithms || {};
  global.VisuDSA.algorithms.quickSort = quickSort;
})(typeof window !== 'undefined' ? window : globalThis);
