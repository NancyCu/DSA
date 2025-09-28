// Selection Sort with step generator + pseudocode mapping (ES module)
export function selectionSort(input) {
  const arr = [...input];
  const steps = [];
  const pseudocode = [
    'for i ← 0 to n-2',
    '    min ← i',
    '    for j ← i+1 to n-1',
    '        if A[j] < A[min]',
    '            min ← j',
    '    swap A[i], A[min]'
  ];

  const meta = {
    complexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)',
    notes: 'Not stable by default. Always performs n(n-1)/2 comparisons regardless of input order.'
  };

  function push(sel = [], compare = [], swap = [], hlLines = [1]) {
    steps.push({ array: [...arr], sel, compare, swap, hlLines });
  }

  push([], [], [], [1]);

  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    push([i], [], [], [1, 2]);
    for (let j = i + 1; j < arr.length; j++) {
      push([i, min], [j], [], [3, 4]);
      if (arr[j] < arr[min]) {
        min = j;
        push([i, min], [], [], [5]);
      }
    }
    if (min !== i) {
      const tmp = arr[i];
      arr[i] = arr[min];
      arr[min] = tmp;
      push([i, min], [], [i, min], [6]);
    } else {
      push([i], [], [], [6]);
    }
  }

  push([], [], [], [6]);

  return { steps, pseudocode, meta };
}