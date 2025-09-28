// Merge Sort with step generator + pseudocode mapping (non-module build)
(function (global) {
  function mergeSort(input) {
    const arr = [...input];
    const steps = [];
    const pseudocode = [
      'mergeSort(A, left, right)',
      '    if left \u2265 right return',
      '    mid \u2190 \u230a(left + right) / 2\u230b',
      '    mergeSort(A, left, mid)',
      '    mergeSort(A, mid+1, right)',
      '    merge(A, left, mid, right)',
      'merge(A, left, mid, right)',
      '    i \u2190 left, j \u2190 mid+1, k \u2190 left',
      '    while i \u2264 mid and j \u2264 right',
      '        if A[i] \u2264 A[j]',
      '            temp[k] \u2190 A[i]; i++',
      '        else',
      '            temp[k] \u2190 A[j]; j++',
      '        k++',
      '    copy remaining elements of left or right to temp',
      '    copy temp[left..right] back into A'
    ];

    const meta = {
      complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
      space: 'O(n)',
      notes: 'Stable divide-and-conquer algorithm. Uses auxiliary array during merge.'
    };

    function push(sel = [], compare = [], swap = [], hlLines = [1]) {
      steps.push({ array: [...arr], sel, compare, swap, hlLines });
    }

    push([], [], [], [1]);

    const temp = new Array(arr.length);

    function merge(left, mid, right) {
      let i = left;
      let j = mid + 1;
      let k = left;
      push(Array.from({ length: right - left + 1 }, (_, idx) => left + idx), [], [], [7, 8]);
      while (i <= mid && j <= right) {
        push([i, j], [i, j], [], [9, 10]);
        if (arr[i] <= arr[j]) {
          temp[k] = arr[i];
          push([k], [], [i], [11]);
          i++;
        } else {
          temp[k] = arr[j];
          push([k], [], [j], [12, 13]);
          j++;
        }
        k++;
        push([k - 1], [], [], [14]);
      }
      while (i <= mid) {
        temp[k] = arr[i];
        push([k], [], [i], [15]);
        i++;
        k++;
      }
      while (j <= right) {
        temp[k] = arr[j];
        push([k], [], [j], [15]);
        j++;
        k++;
      }
      for (let idx = left; idx <= right; idx++) {
        arr[idx] = temp[idx];
        push([idx], [], [idx], [16]);
      }
    }

    function sort(left, right) {
      if (left >= right) {
        push([left], [], [], [1, 2]);
        return;
      }
      const mid = Math.floor((left + right) / 2);
      push(Array.from({ length: right - left + 1 }, (_, idx) => left + idx), [], [], [1, 3]);
      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }

    if (arr.length > 0) {
      sort(0, arr.length - 1);
    }

    return { steps, pseudocode, meta };
  }

  global.VisuDSA = global.VisuDSA || {};
  global.VisuDSA.algorithms = global.VisuDSA.algorithms || {};
  global.VisuDSA.algorithms.mergeSort = mergeSort;
})(typeof window !== 'undefined' ? window : globalThis);
