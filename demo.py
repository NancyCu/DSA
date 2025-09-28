#!/usr/bin/env python3
"""
DSA Algorithms Demo Script

This script demonstrates all implemented algorithms with sample data.
Run this to see a quick overview of all algorithms in action.
"""

import sys
import os
import random
from typing import List

# Add the DSA directory to path so we can import our modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import all sorting algorithms
from sorting.bubble_sort import bubble_sort
from sorting.selection_sort import selection_sort
from sorting.insertion_sort import insertion_sort
from sorting.merge_sort import merge_sort
from sorting.quick_sort import quick_sort
from sorting.heap_sort import heap_sort
from sorting.radix_sort import radix_sort
from sorting.count_sort import count_sort

# Import searching algorithms
from searching.linear_search import linear_search
from searching.binary_search import binary_search

# Import graph algorithms
from graph.dfs import dfs_recursive, dfs_iterative
from graph.bfs import bfs


def print_header(title: str):
    """Print a formatted header"""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")


def print_subheader(title: str):
    """Print a formatted subheader"""
    print(f"\n{'-'*40}")
    print(f"  {title}")
    print(f"{'-'*40}")


def demo_sorting_algorithms():
    """Demonstrate all sorting algorithms"""
    print_header("SORTING ALGORITHMS DEMO")
    
    # Test data
    test_data = [64, 34, 25, 12, 22, 11, 90, 5, 77, 30]
    print(f"Original array: {test_data}")
    
    # List of sorting algorithms to test
    sorting_algorithms = [
        ("Bubble Sort", bubble_sort),
        ("Selection Sort", selection_sort),
        ("Insertion Sort", insertion_sort),
        ("Merge Sort", merge_sort),
        ("Quick Sort", quick_sort),
        ("Heap Sort", heap_sort),
    ]
    
    print(f"\nTesting comparison-based sorting algorithms:")
    for name, algorithm in sorting_algorithms:
        result = algorithm(test_data.copy())
        print(f"  {name:15}: {result}")
    
    # Test non-comparison based sorts (require non-negative integers)
    positive_data = [64, 34, 25, 12, 22, 11, 90, 5, 77, 30]
    print(f"\nTesting non-comparison based sorting algorithms:")
    print(f"Input (non-negative): {positive_data}")
    
    try:
        result = radix_sort(positive_data)
        print(f"  {'Radix Sort':15}: {result}")
    except Exception as e:
        print(f"  {'Radix Sort':15}: Error - {e}")
    
    try:
        result = count_sort(positive_data)
        print(f"  {'Count Sort':15}: {result}")
    except Exception as e:
        print(f"  {'Count Sort':15}: Error - {e}")


def demo_searching_algorithms():
    """Demonstrate searching algorithms"""
    print_header("SEARCHING ALGORITHMS DEMO")
    
    # Create test data
    test_data = list(range(1, 21, 2))  # [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    search_targets = [7, 15, 20, 1]
    
    print(f"Sorted array: {test_data}")
    print(f"Search targets: {search_targets}")
    
    print(f"\nSearch Results:")
    for target in search_targets:
        linear_result = linear_search(test_data, target)
        binary_result = binary_search(test_data, target)
        
        print(f"  Target {target:2d}: Linear={linear_result:2d}, Binary={binary_result:2d}")


def demo_graph_algorithms():
    """Demonstrate graph algorithms"""
    print_header("GRAPH ALGORITHMS DEMO")
    
    # Create test graph
    graph = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B', 'F'],
        'F': ['C', 'E']
    }
    
    print("Test Graph (Adjacency List):")
    for vertex, neighbors in graph.items():
        print(f"  {vertex}: {neighbors}")
    
    start_vertex = 'A'
    print(f"\nTraversal from vertex '{start_vertex}':")
    
    # DFS traversal
    dfs_recursive_result = dfs_recursive(graph, start_vertex)
    dfs_iterative_result = dfs_iterative(graph, start_vertex)
    
    print(f"  DFS (Recursive): {dfs_recursive_result}")
    print(f"  DFS (Iterative): {dfs_iterative_result}")
    
    # BFS traversal
    bfs_result = bfs(graph, start_vertex)
    print(f"  BFS:             {bfs_result}")


def performance_comparison():
    """Show performance comparison with different input sizes"""
    print_header("PERFORMANCE COMPARISON")
    
    import time
    
    # Test different array sizes
    sizes = [100, 1000]
    
    for size in sizes:
        print(f"\nTesting with array size: {size}")
        # Generate random data
        test_data = [random.randint(1, 1000) for _ in range(size)]
        
        # Test a few algorithms
        algorithms = [
            ("Bubble Sort", bubble_sort),
            ("Quick Sort", quick_sort),
            ("Merge Sort", merge_sort),
        ]
        
        for name, algorithm in algorithms:
            start_time = time.time()
            algorithm(test_data.copy())
            end_time = time.time()
            
            print(f"  {name:12}: {end_time - start_time:.4f} seconds")


def main():
    """Main demo function"""
    print("🚀 DSA Algorithms Comprehensive Demo")
    print("This demo showcases all implemented algorithms")
    
    # Run all demos
    demo_sorting_algorithms()
    demo_searching_algorithms()
    demo_graph_algorithms()
    
    # Optional performance test (comment out if you want to skip)
    try:
        performance_comparison()
    except KeyboardInterrupt:
        print("\n⏭️  Performance test skipped")
    
    print_header("DEMO COMPLETE")
    print("✅ All algorithms demonstrated successfully!")
    print("\n💡 Tips:")
    print("  • Run individual algorithm files for detailed examples")
    print("  • Use '_verbose' functions for step-by-step execution")
    print("  • Check PYTHON_ALGORITHMS_README.md for detailed documentation")
    print("\n🎓 Happy Learning!")


if __name__ == "__main__":
    main()