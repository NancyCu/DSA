# VisuDSA — Interactive Data Structure & Algorithm Playground

https://nancycu.github.io/DSA/

VisuDSA is a framework-free visualization lab for exploring classic data structure and algorithm (DSA) ideas. It combines an interactive web UI for step-by-step walkthroughs with a companion library of Python reference implementations, making it useful for teaching, self-study, and quick demos.

## 📚 Table of Contents
- [Highlights](#-highlights)
- [Available Algorithms](#-available-algorithms)
- [Running the Project](#-running-the-project)
- [Using the Visualizer](#-using-the-visualizer)
- [Python Reference Implementations](#-python-reference-implementations)
- [Project Structure](#-project-structure)
- [Extend the Visualizer](#-extend-the-visualizer)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)

## ✨ Highlights
- **Step-by-step visualizations** with transport controls (first/prev/play/next/last) and adjustable playback speed for every supported algorithm.
- **Context-aware inputs** that adapt based on the algorithm family—sorting arrays, search targets, or BST operations—with quick randomization, reset, haptics toggle, and mini-toolbar for collapsed layouts.
- **Dynamic pseudocode pane** that highlights the current line as the animation progresses, helping map code to state changes.
- **Complexity dashboard** showing best/average/worst time, space usage, and author notes for each algorithm.
- **Recurrence analysis tools** that auto-populate level-by-level breakdowns (including Master Theorem style summaries for divide-and-conquer sorts) with optional numeric mode and configurable constants.
- **Binary Search Tree playground** that lets you insert, search, and reset nodes while animating traversal decisions and tracking the evolving tree structure.
- **Persistent preferences** (algorithm selections, analysis mode, input panel layout, random size, fit-to-screen toggle, etc.) saved to `localStorage` so sessions pick up where you left off.
- **Responsive, touch-friendly design** with optional haptic feedback and mobile-friendly collapsed inputs panel.

## 🧠 Available Algorithms
### Sorting Visualizations (JavaScript)
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort (with divide-and-conquer analysis table)
- Quick Sort (average/worst case recurrence modes)

### Searching Visualizations (JavaScript)
- Linear Search
- Binary Search (midpoint focus with branching visualization)

### Tree Visualizations (JavaScript)
- Binary Search Tree (insert/search operations with node-level call traces)

### Python Reference Library
- Sorting: Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, Count
- Searching: Linear, Binary
- Graph traversal: Breadth-First Search (BFS), Depth-First Search (DFS)

## 🏃 Running the Project
### Web Visualizer
1. Clone or download the repository.
2. Open `index.html` directly in any modern browser (no build tools or servers required).
3. Start exploring—data changes, controls, and animations run entirely client-side.

### Python Algorithms
Each Python module is executable on its own:
```bash
python sorting/quick_sort.py
python searching/binary_search.py
python graph/bfs.py
```
These scripts print sample runs, edge cases, and (where available) verbose step-by-step traces.

## 🎬 Using the Visualizer
1. **Select an algorithm family** (Sorting, Searching, Trees) and choose a specific algorithm from the dropdown.
2. **Provide input data**:
   - Sorting: comma-separated array, optional random generator with adjustable `n` and “generate sorted” toggle.
   - Searching: array plus numeric target field.
   - Trees: use the BST toolbar to insert/search values or clear the tree.
3. **Load the data** via **Load** (or use the 🎲 Random button/mini-toolbar shortcuts).
4. **Control playback** with the transport buttons or keyboard, adjust speed, and watch the pseudocode and visual state evolve.
5. **Study complexity and analysis** in the side panels—switch between average/worst recurrence for Quick Sort, enable numeric mode, or tweak constants to see how the table updates live.
6. **Reset preferences** at any time with the Reset button, which clears persisted UI choices, haptics, analysis settings, and saved algorithms.

## 🐍 Python Reference Implementations
The `sorting`, `searching`, and `graph` directories provide production-ready yet learner-friendly implementations:
- Extensive docstrings, inline commentary, and time/space complexity callouts.
- Verbose/educational variants (e.g., `bubble_sort_verbose`, `dfs_verbose`) to follow algorithm logic step-by-step in the console.
- Built-in example drivers demonstrating typical use cases, corner cases, and expected results.

Use them alongside the visualizer to compare theoretical behavior with concrete code, or as a starting point for assignments and experiments.

## 🗂 Project Structure
```
DSA/
├── algorithms/        # ES module visualizer algorithms (sorting/searching/BST)
├── sorting/           # Python sorting implementations
├── searching/         # Python searching implementations
├── graph/             # Python graph traversals
├── app.js             # Visualizer controller and state management
├── index.html         # UI layout & controls
├── styles.css         # Theming and responsive design
├── demo.py            # Example Python entry point (customize as needed)
└── README.md          # This documentation
```

## 🧩 Extend the Visualizer
1. Add a new ES module under `algorithms/yourAlgo.js` exporting `{ steps, pseudocode, meta }`.
2. Import it in `app.js` and register it under the appropriate algorithm family.
3. Add a corresponding `<option>` to the `<select>` in `index.html`.
4. (Optional) Provide analysis helpers if the algorithm benefits from recurrence tables or custom metrics.

The UI automatically wires your `steps` snapshots to the visualization canvas, pseudocode highlighter, complexity panel, and analysis widgets.

## 🛠 Tech Stack
- Vanilla JavaScript (ES modules) for interactivity and state management
- HTML/CSS with custom components—no frameworks or build pipeline
- Python 3.x standard library implementations for companion scripts

## 🤝 Contributing
Contributions are welcome! Consider sharing additional algorithms, UX improvements, accessibility tweaks, or documentation updates. Please open an issue or submit a pull request describing your enhancement or fix.

Happy learning and tinkering! 🚀
