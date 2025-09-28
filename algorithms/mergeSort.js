// Merge Sort with step generator + pseudocode mapping (ES module)
export function mergeSort(input) {
  const arr = [...input];
  const steps = [];
  const pseudocode = [
    'mergeSort(A, left, right)',
    '    if left ≥ right return',
    '    mid ← ⌊(left + right) / 2⌋',
    '    mergeSort(A, left, mid)',
    '    mergeSort(A, mid+1, right)',
    '    merge(A, left, mid, right)',
    'merge(A, left, mid, right)',
    '    i ← left, j ← mid+1, k ← left',
    '    while i ≤ mid and j ≤ right',
    '        if A[i] ≤ A[j]',
    '            temp[k] ← A[i]; i++',
    '        else',
    '            temp[k] ← A[j]; j++',
    '        k++',
    '    copy remaining elements of left or right to temp',
    '    copy temp[left..right] back into A'
  ];

  const meta = {
    complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(n)',
    notes: 'Stable divide-and-conquer algorithm. Uses auxiliary array during merge.'
  };

  function push(sel = [], compare = [], swap = [], hlLines = [1], seg = null) {
    const snapshot = { array: [...arr], sel, compare, swap, hlLines };
    if (seg) snapshot.segment = seg; // {left,right}
    steps.push(snapshot);
  }

  push([], [], [], [1]);

  const temp = new Array(arr.length);

  function merge(left, mid, right) {
    let i = left;
    let j = mid + 1;
    let k = left;
    push(Array.from({ length: right - left + 1 }, (_, idx) => left + idx), [], [], [7, 8], { left, right });
    while (i <= mid && j <= right) {
      push([i, j], [i, j], [], [9, 10], { left, right });
      if (arr[i] <= arr[j]) {
        temp[k] = arr[i];
        push([k], [], [i], [11], { left, right });
        i++;
      } else {
        temp[k] = arr[j];
        push([k], [], [j], [12, 13], { left, right });
        j++;
      }
      k++;
      push([k - 1], [], [], [14], { left, right });
    }
    while (i <= mid) {
      temp[k] = arr[i];
      push([k], [], [i], [15], { left, right });
      i++;
      k++;
    }
    while (j <= right) {
      temp[k] = arr[j];
      push([k], [], [j], [15], { left, right });
      j++;
      k++;
    }
    for (let idx = left; idx <= right; idx++) {
      arr[idx] = temp[idx];
      push([idx], [], [idx], [16], { left, right });
    }
  }

  function sort(left, right) {
    if (left >= right) {
      push([left], [], [], [1, 2]);
      return;
    }
    const mid = Math.floor((left + right) / 2);
    push(Array.from({ length: right - left + 1 }, (_, idx) => left + idx), [], [], [1, 3], { left, right });
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  if (arr.length > 0) {
    sort(0, arr.length - 1);
  }

  return { steps, pseudocode, meta };
}