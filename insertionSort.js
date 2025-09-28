// Insertion Sort with step generator + pseudocode mapping
export function insertionSort(input) {
  const arr = [...input];
  const steps = [];
  const pseudocode = [
    'for i ← 1 to n-1',
    '    key ← A[i]',
    '    j ← i-1',
    '    while j ≥ 0 and A[j] > key',
    '        A[j+1] ← A[j]',
    '        j ← j-1',
    '    A[j+1] ← key'
  ];

  const meta = {
    complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
    space: 'O(1)',
    notes: 'Stable, in-place. Best case when array is already sorted (only n-1 comparisons).'
  };

  function push(array, sel=[], compare=[], swap=[], hlLines=[1]) {
    steps.push({ array: [...array], sel, compare, swap, hlLines });
  }

  push(arr, [], [], [], [1]); // initial

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];        // line 2
    let j = i - 1;             // line 3
    push(arr, [i], [], [], [1,2,3]);

    while (j >= 0 && arr[j] > key) {
      // compare j with key
      push(arr, [i], [j, j+1], [], [4]);
      arr[j+1] = arr[j];       // shift right
      push(arr, [i], [], [j, j+1], [5]);
      j = j - 1;               // move left
      push(arr, [i], [], [], [6]);
    }
    arr[j+1] = key;            // place key
    push(arr, [j+1], [], [], [7]);
  }

  return { steps, pseudocode, meta };
}
