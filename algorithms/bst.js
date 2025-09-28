// Binary Search Tree (BST) with step generator for insert and search
// Nodes: {id, key, left, right}
// Steps for visualization include layout positions computed later in render

let _nextNodeId = 1;
function newId(){ return _nextNodeId++; }

export function createBST(initial = []) {
  const state = { root: null };
  const steps = [];
  const pseudocode = [
    'struct Node { int key; Node *left, *right; }',
    'Node* insert(Node* root, int key)',
    '    if (root == NULL) return new Node(key)',
    '    if (key < root->key) root->left = insert(root->left, key)',
    '    else if (key > root->key) root->right = insert(root->right, key)',
    '    return root',
    'Node* search(Node* root, int key)',
    '    if (root == NULL || root->key == key) return root',
    '    if (key < root->key) return search(root->left, key)',
    '    else return search(root->right, key)'
  ];
  const meta = {
    complexity: { best: 'O(log n)', avg: 'O(log n)', worst: 'O(n)' },
    space: 'O(h)',
    notes: 'Unbalanced BST. Worst-case degenerate to O(n). Use AVL/Red-Black for balancing.'
  };

  function snapshot(highlight = {}, hlLines = []) {
    steps.push({ tree: cloneTree(state.root), highlight, hlLines });
  }

  function cloneTree(node){
    if (!node) return null;
    return { id: node.id, key: node.key, left: cloneTree(node.left), right: cloneTree(node.right) };
  }

  function insert(key) {
    function _insert(node, key) {
      snapshot({ nodeId: node?.id, key, op: 'insert-visit' }, [2,3]);
      if (!node) {
        const newNode = { id: newId(), key, left: null, right: null };
        snapshot({ nodeId: newNode.id, key, op: 'insert-new' }, [2]);
        return newNode;
      }
      if (key < node.key) {
        snapshot({ nodeId: node.id, key, dir: 'L', op: 'cmp' }, [4]);
        node.left = _insert(node.left, key);
      } else if (key > node.key) {
        snapshot({ nodeId: node.id, key, dir: 'R', op: 'cmp' }, [5]);
        node.right = _insert(node.right, key);
      } else {
        // duplicate: no-op
      }
      snapshot({ nodeId: node.id, key, op: 'ret' }, [6]);
      return node;
    }
    state.root = _insert(state.root, key);
  }

  function search(key) {
    let node = state.root;
    while (true) {
      snapshot({ nodeId: node?.id, key, op: 'search-visit' }, [7,8]);
      if (!node || node.key === key) break;
      if (key < node.key) {
        snapshot({ nodeId: node.id, key, dir: 'L', op: 'cmp' }, [9]);
        node = node.left;
      } else {
        snapshot({ nodeId: node.id, key, dir: 'R', op: 'cmp' }, [10]);
        node = node.right;
      }
    }
    snapshot({ nodeId: node?.id, key, op: 'search-result', found: !!node }, [8]);
  }

  // initialize with values
  for (const k of initial) insert(k);

  return { steps, pseudocode, meta, state, api: { insert, search } };
}
