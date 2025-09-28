// Binary Search with array visualization (sorted linked list concept for C-style)
export function binarySearch(input, target = null) {
  // For binary search, we'll show array-based approach but with C-style indexing
  const arr = [...input].sort((a, b) => a - b); // Ensure sorted
  const steps = [];
  const pseudocode = [
    'int binarySearch(int arr[], int n, int target)',
    '    int left = 0, right = n - 1;',
    '    while (left <= right)',
    '        int mid = left + (right - left) / 2;',
    '        if (arr[mid] == target)',
    '            return mid;  // Found',
    '        else if (arr[mid] > target)',
    '            right = mid - 1;  // Search left half',
    '        else',
    '            left = mid + 1;   // Search right half',
    '    return -1;  // Not found'
  ];

  const meta = {
    complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' },
    space: 'O(1)',
    notes: 'Requires sorted array. In C, we use array indexing with pointers. Much faster than linear search for large datasets.'
  };

  function push(array, left = -1, right = -1, mid = -1, found = false, hlLines = [1]) {
    steps.push({
      array: [...array],
      left,
      right, 
      mid,
      found,
      hlLines,
      target: target
    });
  }

  // If no target specified, use middle element for demo
  if (target === null) {
    target = arr[Math.floor(arr.length / 2)] || 0;
  }

  push(arr, -1, -1, -1, false, [1, 2]);

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    push(arr, left, right, -1, false, [3, 4]);
    
    const mid = Math.floor(left + (right - left) / 2);
    push(arr, left, right, mid, false, [4]);

    if (arr[mid] === target) {
      push(arr, left, right, mid, true, [5, 6]);
      break;
    } else if (arr[mid] > target) {
      push(arr, left, right, mid, false, [7, 8]);
      right = mid - 1;
    } else {
      push(arr, left, right, mid, false, [9, 10]);
      left = mid + 1;
    }
  }

  if (left > right) {
    // Not found
    push(arr, left, right, -1, false, [11]);
  }

  return { steps, pseudocode, meta };
}