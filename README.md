# VisuDSA — Starter (Vanilla JS)

A tiny, framework-free starter to build a VisuAlgo-style app: step-by-step visualizations, highlighted pseudocode, and complexity info.

## Features
- 🎞️ Stepper controls (first/prev/play/next/last)
- 📊 Bar-chart style array view with compare/swap highlights
- 📜 Line-highlighted pseudocode
- ⏱️ Complexity panel (best/avg/worst/space) + notes
- 🧩 Pluggable algorithms via `algorithms/*.js`

## Quick Start
1. Open `index.html` in a browser (no build step).
2. Type numbers like `5,2,9,1,5,6` and hit **Load** or click **🎲 Random**.
3. Use the transport controls to step through the algorithm.

## Add an Algorithm
Create a file in `algorithms/yourAlgo.js` that exports a function with this signature:

```js
export function yourAlgo(input) {
  // Build `steps` as an array of objects:
  // { array: number[], sel?: number[], compare?: number[], swap?: number[], hlLines?: number[] }
  const steps = [];
  const pseudocode = [/* lines as strings */];
  const meta = {
    complexity: { best: 'O(?)', avg: 'O(?)', worst: 'O(?)' },
    space: 'O(?)',
    notes: 'Your notes.'
  };
  // push steps like: steps.push({ array:[...arr], sel:[i], compare:[j], swap:[k], hlLines:[1,2] })
  return { steps, pseudocode, meta };
}
```

Then add it to `app.js`:

```js
import { yourAlgo } from './algorithms/yourAlgo.js';
const algorithms = { insertionSort, yourAlgo };
```

And add an `<option>` in `index.html`’s `<select>`.

## Ideas to Expand
- Add Binary Search, Merge Sort, Quick Sort, BFS/DFS on graphs (use SVG)
- Split UI into modules (`components/*`) if you grow the app
- Add a code-pane toggle between pseudocode and real code (JS/Python)
- Export/share steps as JSON for assignments
- Keyboard shortcuts (space = play/pause; ←/→ step)

---

Built as a learning scaffold. Happy hacking! 💻
