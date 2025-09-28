// Bubble Sort with step generator + pseudocode mapping (non-module build)
(function (global) {
  function bubbleSort(input) {
    const arr = [...input];
    const steps = [];
    const pseudocode = [
      'for i \u2190 0 to n-2',
      '    swapped \u2190 false',
      '    for j \u2190 0 to n-2-i',
      '        if A[j] > A[j+1]',
      '            swap A[j], A[j+1]',
      '    if not swapped break'
    ];

    const meta = {
      complexity: { best: 'O(n)', avg: 'O(n^2)', worst: 'O(n^2)' },
      space: 'O(1)',
      notes: 'Stable when implemented with adjacent swaps. Early-exit when the array is already sorted.'
    };

    function push(sel = [], compare = [], swap = [], hlLines = [1]) {
      steps.push({ array: [...arr], sel, compare, swap, hlLines });
    }

    push([], [], [], [1]);

    for (let i = 0; i < arr.length - 1; i++) {
      let swapped = false;
      push([arr.length - 1 - i], [], [], [1, 2]);
      for (let j = 0; j < arr.length - 1 - i; j++) {
        push([j], [j, j + 1], [], [3, 4]);
        if (arr[j] > arr[j + 1]) {
          const tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
          swapped = true;
          push([j + 1], [], [j, j + 1], [5]);
        }
      }
      push([arr.length - 1 - i], [], [], [6]);
      if (!swapped) break;
    }

    push([], [], [], [6]);

    return { steps, pseudocode, meta };
  }

  global.VisuDSA = global.VisuDSA || {};
  global.VisuDSA.algorithms = global.VisuDSA.algorithms || {};
  global.VisuDSA.algorithms.bubbleSort = bubbleSort;
})(typeof window !== 'undefined' ? window : globalThis);
