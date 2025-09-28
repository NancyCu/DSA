# DSA Algorithms - Python Implementation

This repository contains comprehensive Python implementations of fundamental Data Structures and Algorithms (DSA), organized in a clean, educational, and practical structure.

## 📁 Repository Structure

```
DSA/
├── sorting/           # Sorting Algorithms
│   ├── bubble_sort.py
│   ├── selection_sort.py
│   ├── insertion_sort.py
│   ├── merge_sort.py
│   ├── quick_sort.py
│   ├── heap_sort.py
│   ├── radix_sort.py
│   └── count_sort.py
├── searching/         # Searching Algorithms
│   ├── linear_search.py
│   └── binary_search.py
├── graph/            # Graph Algorithms
│   ├── dfs.py
│   └── bfs.py
└── algorithms/       # JavaScript implementations (existing)
```

## 🚀 Quick Start

Each algorithm file can be run independently to see examples and test cases:

```bash
# Run any algorithm to see examples
python sorting/bubble_sort.py
python searching/binary_search.py
python graph/bfs.py
```

## 📚 Algorithms Overview

### Sorting Algorithms

| Algorithm | File | Time Complexity | Space | Stable | Best Use Case |
|-----------|------|----------------|-------|--------|---------------|
| **Bubble Sort** | `bubble_sort.py` | O(n²) | O(1) | ✅ | Educational, small datasets |
| **Selection Sort** | `selection_sort.py` | O(n²) | O(1) | ❌ | Small datasets, memory-constrained |
| **Insertion Sort** | `insertion_sort.py` | O(n²) | O(1) | ✅ | Small/mostly sorted datasets |
| **Merge Sort** | `merge_sort.py` | O(n log n) | O(n) | ✅ | Large datasets, guaranteed performance |
| **Quick Sort** | `quick_sort.py` | O(n log n) avg | O(log n) | ❌ | General purpose, fast average case |
| **Heap Sort** | `heap_sort.py` | O(n log n) | O(1) | ❌ | Guaranteed O(n log n), in-place |
| **Radix Sort** | `radix_sort.py` | O(d×n) | O(n+k) | ✅ | Integer sorting, large datasets |
| **Count Sort** | `count_sort.py` | O(n+k) | O(k) | ✅ | Small range integers |

### Searching Algorithms

| Algorithm | File | Time Complexity | Space | Prerequisites |
|-----------|------|----------------|-------|---------------|
| **Linear Search** | `linear_search.py` | O(n) | O(1) | None |
| **Binary Search** | `binary_search.py` | O(log n) | O(1) | Sorted array |

### Graph Algorithms

| Algorithm | File | Time Complexity | Space | Use Cases |
|-----------|------|----------------|-------|-----------|
| **DFS** | `dfs.py` | O(V + E) | O(V) | Path finding, cycles, connectivity |
| **BFS** | `bfs.py` | O(V + E) | O(V) | Shortest path, level traversal |

## 💡 Usage Examples

### Basic Usage

```python
from sorting.quick_sort import quick_sort
from searching.binary_search import binary_search
from graph.bfs import bfs

# Sorting
arr = [64, 34, 25, 12, 22, 11, 90]
sorted_arr = quick_sort(arr)
print(f"Sorted: {sorted_arr}")  # [11, 12, 22, 25, 34, 64, 90]

# Searching
index = binary_search(sorted_arr, 25)
print(f"Found 25 at index: {index}")  # 3

# Graph traversal
graph = {'A': ['B', 'C'], 'B': ['D'], 'C': ['E'], 'D': [], 'E': []}
result = bfs(graph, 'A')
print(f"BFS traversal: {result}")  # ['A', 'B', 'C', 'D', 'E']
```

### Verbose/Educational Mode

Most algorithms include verbose versions for learning:

```python
from sorting.bubble_sort import bubble_sort_verbose
from graph.dfs import dfs_verbose

# See step-by-step execution
arr = [64, 34, 25, 12]
bubble_sort_verbose(arr)

# Watch graph traversal in detail
graph = {'A': ['B', 'C'], 'B': ['D'], 'C': [], 'D': []}
dfs_verbose(graph, 'A')
```

## 🎯 Key Features

### 📖 Educational Focus
- **Comprehensive documentation** with docstrings explaining logic and complexity
- **Step-by-step verbose modes** to visualize algorithm execution
- **Multiple implementation variants** (recursive vs iterative, different approaches)
- **Real-world examples** with practical use cases

### 🧪 Extensive Testing
- **Built-in test cases** for each algorithm
- **Edge case handling** (empty arrays, single elements, duplicates)
- **Performance comparisons** between different variants
- **Error validation** with meaningful messages

### 🔧 Practical Implementation
- **Multiple algorithm variants** (e.g., Quick Sort with different partition schemes)
- **Object-oriented adaptations** for sorting custom objects
- **Advanced features** (finding all occurrences, insertion points, etc.)
- **Real-world applications** (pathfinding, bipartite checking, etc.)

## 🎓 Learning Path

### Beginner
1. **Linear Search** → **Binary Search** (understand search basics)
2. **Bubble Sort** → **Insertion Sort** (simple sorting algorithms)
3. **Selection Sort** (understand selection-based sorting)

### Intermediate
4. **Merge Sort** (divide and conquer concept)
5. **Quick Sort** (partitioning and recursion)
6. **DFS & BFS** (graph traversal fundamentals)

### Advanced
7. **Heap Sort** (heap data structure)
8. **Radix Sort & Count Sort** (non-comparative sorting)
9. **Advanced graph applications** (shortest paths, connectivity)

## 🔍 Algorithm Details

### Time Complexity Quick Reference
- **O(1)**: Constant time - Hash table lookup
- **O(log n)**: Logarithmic - Binary search, heap operations
- **O(n)**: Linear - Array traversal, linear search
- **O(n log n)**: Linearithmic - Optimal comparison sorting
- **O(n²)**: Quadratic - Basic sorting algorithms
- **O(2ⁿ)**: Exponential - Brute force solutions

### Space Complexity Categories
- **O(1)**: In-place algorithms
- **O(log n)**: Recursion stack space
- **O(n)**: Additional arrays/data structures
- **O(n+k)**: Input size + range of values

## 🛠 Requirements

- Python 3.6+ (uses f-strings and other modern features)
- No external dependencies (uses only built-in Python libraries)
- `collections.deque` for BFS implementation

## 📝 Contributing

Feel free to contribute by:
- Adding more algorithms
- Improving documentation
- Adding visualization features
- Optimizing existing implementations
- Adding more test cases

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Learning! 🚀**

Each algorithm implementation is designed to be both educational and practical. Start with the basics and work your way up to more complex algorithms. The verbose modes are particularly helpful for understanding how each algorithm works step by step.