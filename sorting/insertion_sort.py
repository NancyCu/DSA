"""
Insertion Sort Algorithm Implementation

Insertion Sort builds the final sorted array one item at a time. It is much less efficient
on large lists than more advanced algorithms like quicksort, heapsort, or merge sort.
However, it has several advantages:
- Simple implementation
- Efficient for small datasets
- Adaptive (efficient for data sets that are already substantially sorted)
- Stable (doesn't change relative order of elements with equal keys)
- In-place (only requires O(1) additional memory)

Time Complexity:
- Best Case: O(n) - when the array is already sorted
- Average Case: O(n²)
- Worst Case: O(n²) - when the array is reverse sorted

Space Complexity: O(1) - only uses a constant amount of extra space

Stability: Stable - maintains relative order of equal elements
"""

def insertion_sort(arr):
    """
    Sorts an array using the insertion sort algorithm.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: A new sorted list (original list is not modified)
        
    Examples:
        >>> insertion_sort([64, 34, 25, 12, 22, 11, 90])
        [11, 12, 22, 25, 34, 64, 90]
        
        >>> insertion_sort([5, 2, 8, 1, 9])
        [1, 2, 5, 8, 9]
        
        >>> insertion_sort([1])
        [1]
        
        >>> insertion_sort([])
        []
    """
    # Create a copy of the array to avoid modifying the original
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    # Handle edge cases
    if n <= 1:
        return arr_copy
    
    # Traverse through 1 to n (we start from index 1, not 0)
    for i in range(1, n):
        # Current element to be positioned
        key = arr_copy[i]
        
        # Move elements of arr_copy[0..i-1] that are greater than key
        # one position ahead of their current position
        j = i - 1
        
        # Shift elements to the right until we find the correct position for key
        while j >= 0 and arr_copy[j] > key:
            arr_copy[j + 1] = arr_copy[j]
            j -= 1
        
        # Place the key at its correct position
        arr_copy[j + 1] = key
    
    return arr_copy


def insertion_sort_verbose(arr):
    """
    Insertion sort with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: Sorted list
    """
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    print(f"Starting Insertion Sort with array: {arr_copy}")
    print("-" * 50)
    
    if n <= 1:
        print("Array has 0 or 1 element, already sorted!")
        return arr_copy
    
    for i in range(1, n):
        key = arr_copy[i]
        j = i - 1
        
        print(f"\nStep {i}: Inserting {key} into sorted portion {arr_copy[:i]}")
        print(f"  Key to insert: {key} (from index {i})")
        print(f"  Sorted portion: {arr_copy[:i]}")
        
        # Find position and shift elements
        original_j = j
        while j >= 0 and arr_copy[j] > key:
            print(f"  {arr_copy[j]} > {key}, shifting {arr_copy[j]} right")
            arr_copy[j + 1] = arr_copy[j]
            j -= 1
        
        # Insert the key
        arr_copy[j + 1] = key
        
        if j == original_j:
            print(f"  {key} is already in correct position")
        else:
            print(f"  Inserted {key} at index {j + 1}")
        
        print(f"  Array after step {i}: {arr_copy}")
    
    print(f"\nFinal sorted array: {arr_copy}")
    return arr_copy


def insertion_sort_binary_search(arr):
    """
    An optimized version of insertion sort using binary search to find
    the insertion position. This reduces comparisons from O(n) to O(log n)
    per element, but doesn't improve the overall time complexity due to
    the shifting operations.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: A new sorted list
    """
    def binary_search_insertion_point(sorted_arr, key, start, end):
        """Find the insertion point using binary search"""
        while start < end:
            mid = (start + end) // 2
            if sorted_arr[mid] <= key:
                start = mid + 1
            else:
                end = mid
        return start
    
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    if n <= 1:
        return arr_copy
    
    for i in range(1, n):
        key = arr_copy[i]
        # Find insertion point using binary search
        insertion_point = binary_search_insertion_point(arr_copy, key, 0, i)
        
        # Shift elements to make room for the key
        for j in range(i, insertion_point, -1):
            arr_copy[j] = arr_copy[j - 1]
        
        # Insert the key at the correct position
        arr_copy[insertion_point] = key
    
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
    
    print("=== Insertion Sort Test Cases ===\n")
    
    for i, test_arr in enumerate(test_arrays):
        print(f"Test Case {i + 1}:")
        print(f"Original: {test_arr}")
        result = insertion_sort(test_arr)
        print(f"Sorted:   {result}")
        print()
    
    # Test binary search variant
    print("=== Binary Search Insertion Sort Test ===\n")
    test_array = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original: {test_array}")
    result = insertion_sort_binary_search(test_array)
    print(f"Sorted:   {result}")
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [64, 34, 25, 12, 22]
    insertion_sort_verbose(sample_array)