// Linear Search with linked list visualization for C-style data structures
export function linearSearch(input, target = null) {
  // Convert array to linked list structure for visualization
  const nodes = input.map((value, index) => ({
    value,
    index,
    next: index < input.length - 1 ? index + 1 : null
  }));
  
  const steps = [];
  const pseudocode = [
    'struct Node* linearSearch(struct Node* head, int target)',
    '    struct Node* current = head;',
    '    int position = 0;',
    '    while (current != NULL)',
    '        if (current->data == target)',
    '            return current;  // Found',
    '        current = current->next;',
    '        position++;',
    '    return NULL;  // Not found'
  ];

  const meta = {
    complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' },
    space: 'O(1)',
    notes: 'Sequential search through linked list. Works on unsorted data. In C, we traverse using pointers (head->next->next...).'
  };

  function push(currentNode = null, compareNode = null, found = false, hlLines = [1]) {
    steps.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      currentNode,
      compareNode,
      found,
      hlLines,
      head: 0, // First node is always head
      target: target
    });
  }

  // If no target specified, use middle element for demo
  if (target === null) {
    target = input[Math.floor(input.length / 2)] || 0;
  }

  // Initial state - show head pointer
  push(null, null, false, [1, 2]);

  let current = 0; // Start at head
  let position = 0;

  // Search through the linked list
  while (current !== null) {
    push(current, current, false, [3, 4]);
    
    if (nodes[current].value === target) {
      push(current, current, true, [5, 6]);
      break;
    }
    
    // Move to next node
    push(current, null, false, [7, 8]);
    current = nodes[current].next;
    position++;
  }

  if (current === null) {
    // Not found
    push(null, null, false, [9]);
  }

  return { steps, pseudocode, meta };
}