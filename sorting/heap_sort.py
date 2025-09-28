"""
Heap Sort Algorithm Implementation

Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure.
It was invented by J. W. J. Williams in 1964. The algorithm divides its input into a sorted
and an unsorted region, and iteratively shrinks the unsorted region by extracting the
largest element from it and inserting it into the sorted region.

Key characteristics:
- In-place sorting algorithm
- Not stable (may change relative order of equal elements)
- Consistent O(n log n) performance regardless of input
- Uses heap data structure (complete binary tree)

Time Complexity:
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n log n)

Space Complexity: O(1) - sorts in-place with constant extra space

Stability: Not stable - may change relative order of equal elements
"""

def heap_sort(arr):
    """
    Sorts an array using the heap sort algorithm.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: A new sorted list (original list is not modified)
        
    Examples:
        >>> heap_sort([64, 34, 25, 12, 22, 11, 90])
        [11, 12, 22, 25, 34, 64, 90]
        
        >>> heap_sort([5, 2, 8, 1, 9])
        [1, 2, 5, 8, 9]
        
        >>> heap_sort([1])
        [1]
        
        >>> heap_sort([])
        []
    """
    # Create a copy of the array to avoid modifying the original
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    # Handle edge cases
    if n <= 1:
        return arr_copy
    
    def heapify(arr, n, i):
        """
        Maintain the max-heap property.
        Assumes that the subtrees rooted at left and right children are max-heaps,
        but arr[i] might be smaller than its children.
        
        Args:
            arr (list): Array representing the heap
            n (int): Size of heap
            i (int): Root of subtree to heapify
        """
        largest = i  # Initialize largest as root
        left = 2 * i + 1  # Left child
        right = 2 * i + 2  # Right child
        
        # Check if left child exists and is greater than root
        if left < n and arr[left] > arr[largest]:
            largest = left
        
        # Check if right child exists and is greater than largest so far
        if right < n and arr[right] > arr[largest]:
            largest = right
        
        # If largest is not root, swap and continue heapifying
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            # Recursively heapify the affected subtree
            heapify(arr, n, largest)
    
    # Build a max heap (rearrange array)
    # Start from the last non-leaf node and heapify each node
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr_copy, n, i)
    
    # Extract elements from heap one by one
    for i in range(n - 1, 0, -1):
        # Move current root (maximum) to end
        arr_copy[0], arr_copy[i] = arr_copy[i], arr_copy[0]
        
        # Call heapify on the reduced heap
        heapify(arr_copy, i, 0)
    
    return arr_copy


def heap_sort_verbose(arr):
    """
    Heap sort with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: Sorted list
    """
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    print(f"Starting Heap Sort with array: {arr_copy}")
    print("-" * 60)
    
    if n <= 1:
        print("Array has 0 or 1 element, already sorted!")
        return arr_copy
    
    def heapify_verbose(arr, n, i, phase=""):
        """Heapify with verbose output"""
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        print(f"  Heapifying node {i} (value: {arr[i]}) {phase}")
        print(f"    Left child: {left} (value: {arr[left] if left < n else 'None'})")
        print(f"    Right child: {right} (value: {arr[right] if right < n else 'None'})")
        
        # Find largest among root, left child and right child
        if left < n and arr[left] > arr[largest]:
            largest = left
        
        if right < n and arr[right] > arr[largest]:
            largest = right
        
        # If largest is not root, swap and continue heapifying
        if largest != i:
            print(f"    Swapping {arr[i]} (index {i}) with {arr[largest]} (index {largest})")
            arr[i], arr[largest] = arr[largest], arr[i]
            print(f"    Array after swap: {arr}")
            heapify_verbose(arr, n, largest, phase)
        else:
            print(f"    No swap needed - heap property satisfied")
    
    # Phase 1: Build max heap
    print("PHASE 1: Building Max Heap")
    print("=" * 30)
    
    # Start from the last non-leaf node and heapify each node
    for i in range(n // 2 - 1, -1, -1):
        print(f"\nHeapifying subtree rooted at index {i}")
        heapify_verbose(arr_copy, n, i, "during heap build")
        print(f"Heap state: {arr_copy}")
    
    print(f"\nMax heap built: {arr_copy}")
    
    # Phase 2: Extract elements from heap
    print("\nPHASE 2: Extracting Elements")
    print("=" * 30)
    
    for i in range(n - 1, 0, -1):
        print(f"\nStep {n - i}: Extracting maximum element")
        print(f"  Current heap: {arr_copy[:i+1]} | Sorted: {arr_copy[i+1:]}")
        print(f"  Moving max element {arr_copy[0]} to position {i}")
        
        # Move current root to end
        arr_copy[0], arr_copy[i] = arr_copy[i], arr_copy[0]
        print(f"  After extraction: {arr_copy}")
        
        # Heapify the reduced heap
        if i > 1:  # Only heapify if there's more than one element
            print(f"  Restoring heap property for heap of size {i}")
            heapify_verbose(arr_copy, i, 0, f"after extracting element to position {i}")
            print(f"  Heap after restoration: {arr_copy[:i]} | Sorted: {arr_copy[i:]}")
    
    print(f"\nFinal sorted array: {arr_copy}")
    return arr_copy


def build_heap_iterative(arr):
    """
    Build a max heap using iterative approach (bottom-up).
    This is an alternative implementation for educational purposes.
    
    Args:
        arr (list): Array to convert to max heap
        
    Returns:
        list: Array representing max heap
    """
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    # Start from the last non-leaf node
    for i in range(n // 2 - 1, -1, -1):
        # Heapify each node
        current = i
        
        while True:
            largest = current
            left = 2 * current + 1
            right = 2 * current + 2
            
            # Find largest among current node and its children
            if left < n and arr_copy[left] > arr_copy[largest]:
                largest = left
            
            if right < n and arr_copy[right] > arr_copy[largest]:
                largest = right
            
            # If largest is not current node, swap and continue
            if largest != current:
                arr_copy[current], arr_copy[largest] = arr_copy[largest], arr_copy[current]
                current = largest
            else:
                break
    
    return arr_copy


# Example usage and test cases
if __name__ == "__main__":
    # Test cases
    test_arrays = [
        [64, 34, 25, 12, 22, 11, 90],
        [5, 2, 8, 1, 9],
        [1, 2, 3, 4, 5],  # Already sorted
        [5, 4, 3, 2, 1],  # Reverse sorted
        [1],              # Single element
        [],               # Empty array
        [3, 3, 3, 3],     # All same elements
    ]
    
    print("=== Heap Sort Test Cases ===\n")
    
    for i, test_arr in enumerate(test_arrays):
        print(f"Test Case {i + 1}:")
        print(f"Original: {test_arr}")
        result = heap_sort(test_arr)
        print(f"Sorted:   {result}")
        print()
    
    # Test heap building function
    print("=== Heap Building Test ===")
    test_array = [4, 10, 3, 5, 1]
    print(f"Original: {test_array}")
    heap = build_heap_iterative(test_array)
    print(f"Max heap: {heap}")
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [64, 34, 25, 12, 22, 11]
    heap_sort_verbose(sample_array)