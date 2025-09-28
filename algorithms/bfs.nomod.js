// Breadth-First Search on adjacency list graph (non-module build)
(function (global) {
  function bfs(input) {
    if (!input || typeof input !== 'object') {
      throw new Error('bfs expects { graph: Record<string, string[]>, start: string }');
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
      'for each vertex v set visited[v] \u2190 false',
      'create empty queue Q',
      'enqueue(start)',
      'visited[start] \u2190 true',
      'while Q not empty',
      '    v \u2190 dequeue(Q)',
      '    for each neighbor w in Adj[v]',
      '        if not visited[w]',
      '            visited[w] \u2190 true',
      '            enqueue(w)'
    ];

    const meta = {
      complexity: { best: 'O(V + E)', avg: 'O(V + E)', worst: 'O(V + E)' },
      space: 'O(V)',
      notes: 'Operates on adjacency-list graphs. Steps record visitation order and queue contents.'
    };

    function push(sel = [], compare = [], swap = [], hlLines = [1], extra = {}) {
      steps.push({ array: [...arr], sel, compare, swap, hlLines, nodes, ...extra });
    }

    const visited = new Set();
    const queue = [];
    let order = 0;

    push([], [], [], [1], { queue: [...queue], visited: Array.from(visited) });

    queue.push(start);
    visited.add(start);
    arr[indexOf.get(start)] = ++order;
    push([indexOf.get(start)], [], [], [2, 3, 4], { queue: [...queue], visited: Array.from(visited) });

    while (queue.length) {
      const v = queue.shift();
      const vIdx = indexOf.get(v);
      push([vIdx], [], [], [5, 6], { queue: [...queue], visited: Array.from(visited), current: v });
      const neighbors = graph[v] || [];
      for (const w of neighbors) {
        const wIdx = indexOf.get(w);
        push([vIdx], [wIdx], [], [7, 8], { queue: [...queue], visited: Array.from(visited), current: v, neighbor: w });
        if (!visited.has(w)) {
          visited.add(w);
          queue.push(w);
          arr[wIdx] = ++order;
          push([wIdx], [], [], [9, 10], { queue: [...queue], visited: Array.from(visited), current: v, neighbor: w });
        }
      }
    }

    return { steps, pseudocode, meta };
  }

  global.VisuDSA = global.VisuDSA || {};
  global.VisuDSA.algorithms = global.VisuDSA.algorithms || {};
  global.VisuDSA.algorithms.bfs = bfs;
})(typeof window !== 'undefined' ? window : globalThis);
