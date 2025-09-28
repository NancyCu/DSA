// Depth-First Search on adjacency list graph (non-module build)
(function (global) {
  function dfs(input) {
    if (!input || typeof input !== 'object') {
      throw new Error('dfs expects { graph: Record<string, string[]>, start: string }');
    }
    const { graph = {}, start } = input;
    const nodes = Array.from(
      new Set(
        Object.keys(graph).concat(
          ...Object.values(graph).map((neighbors) => neighbors ?? [])
        )
      )
    );
    if (nodes.length === 0) {
      return { steps: [], pseudocode: [], meta: {} };
    }
    if (!nodes.includes(start)) {
      throw new Error('Start vertex must exist in the graph.');
    }

    const indexOf = new Map(nodes.map((node, idx) => [node, idx]));
    const arr = nodes.map(() => 0); // visitation order (0 = unvisited)
    const steps = [];
    const pseudocode = [
      'create empty stack S',
      'push(start)',
      'while S not empty',
      '    v \u2190 pop(S)',
      '    if not visited[v]',
      '        visited[v] \u2190 true',
      '        for each neighbor w in reverse(Adj[v])',
      '            if not visited[w]',
      '                push(w)'
    ];

    const meta = {
      complexity: { best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)' },
      space: 'O(V)',
      notes: 'Iterative depth-first traversal using a stack. Reversing adjacency ensures natural recursion order.'
    };

    function push(sel = [], compare = [], swap = [], hlLines = [1], extra = {}) {
      steps.push({ array: [...arr], sel, compare, swap, hlLines, nodes, ...extra });
    }

    const visited = new Set();
    const stack = [];
    let order = 0;

    push([], [], [], [1], { stack: [...stack], visited: Array.from(visited) });

    stack.push(start);
    push([indexOf.get(start)], [], [], [2], { stack: [...stack], visited: Array.from(visited) });

    while (stack.length) {
      const v = stack.pop();
      const vIdx = indexOf.get(v);
      push([vIdx], [], [], [3, 4], { stack: [...stack], visited: Array.from(visited), current: v });
      if (!visited.has(v)) {
        visited.add(v);
        arr[vIdx] = ++order;
        push([vIdx], [], [], [5, 6], { stack: [...stack], visited: Array.from(visited), current: v });
        const neighbors = (graph[v] || []).slice().reverse();
        for (const w of neighbors) {
          const wIdx = indexOf.get(w);
          push([vIdx], [wIdx], [], [7, 8], { stack: [...stack], visited: Array.from(visited), current: v, neighbor: w });
          if (!visited.has(w)) {
            stack.push(w);
            push([wIdx], [], [], [9], { stack: [...stack], visited: Array.from(visited), current: v, neighbor: w });
          }
        }
      }
    }

    return { steps, pseudocode, meta };
  }

  global.VisuDSA = global.VisuDSA || {};
  global.VisuDSA.algorithms = global.VisuDSA.algorithms || {};
  global.VisuDSA.algorithms.dfs = dfs;
})(typeof window !== 'undefined' ? window : globalThis);
