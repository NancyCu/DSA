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
    notes: 'In-place, unstable. Worst case occurs on already sorted input with poor pivot choice.'
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