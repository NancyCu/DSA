"""
Selection Sort Algorithm Implementation

Selection Sort is an in-place comparison sorting algorithm that divides the input list
into two parts: a sorted portion at the left end and an unsorted portion at the right end.
Initially, the sorted portion is empty and the unsorted portion is the entire list.

The algorithm proceeds by finding the smallest (or largest) element in the unsorted portion,
swapping it with the leftmost unsorted element, and moving the subarray boundaries one element to the right.

Time Complexity:
- Best Case: O(n²) - even if array is sorted, we still need to find minimum
- Average Case: O(n²)
- Worst Case: O(n²)

Space Complexity: O(1) - only uses a constant amount of extra space

Stability: Not stable - may change relative order of equal elements
"""

def selection_sort(arr):
    """
    Sorts an array using the selection sort algorithm.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: A new sorted list (original list is not modified)
        
    Examples:
        >>> selection_sort([64, 34, 25, 12, 22, 11, 90])
        [11, 12, 22, 25, 34, 64, 90]
        
        >>> selection_sort([5, 2, 8, 1, 9])
        [1, 2, 5, 8, 9]
        
        >>> selection_sort([1])
        [1]
        
        >>> selection_sort([])
        []
    """
    # Create a copy of the array to avoid modifying the original
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    # Handle edge cases
    if n <= 1:
        return arr_copy
    
    # Traverse through all array elements
    for i in range(n):
        # Find the minimum element in remaining unsorted array
        min_index = i
        
        # Search for the minimum element in the unsorted portion
        for j in range(i + 1, n):
            if arr_copy[j] < arr_copy[min_index]:
                min_index = j
        
        # Swap the found minimum element with the first element of unsorted portion
        if min_index != i:
            arr_copy[i], arr_copy[min_index] = arr_copy[min_index], arr_copy[i]
    
    return arr_copy


def selection_sort_verbose(arr):
    """
    Selection sort with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: Sorted list
    """
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    print(f"Starting Selection Sort with array: {arr_copy}")
    print("-" * 50)
    
    if n <= 1:
        print("Array has 0 or 1 element, already sorted!")
        return arr_copy
    
    for i in range(n):
        print(f"\nStep {i + 1}: Finding minimum in unsorted portion [index {i} to {n-1}]")
        min_index = i
        min_value = arr_copy[i]
        
        print(f"  Current minimum: {min_value} at index {min_index}")
        
        # Find minimum element in remaining unsorted array
        for j in range(i + 1, n):
            print(f"  Comparing with {arr_copy[j]} at index {j}", end="")
            if arr_copy[j] < arr_copy[min_index]:
                min_index = j
                min_value = arr_copy[j]
                print(f" -> New minimum found: {min_value}")
            else:
                print(f" -> Current minimum unchanged")
        
        # Swap if needed
        if min_index != i:
            print(f"  Swapping {arr_copy[i]} at index {i} with {arr_copy[min_index]} at index {min_index}")
            arr_copy[i], arr_copy[min_index] = arr_copy[min_index], arr_copy[i]
        else:
            print(f"  No swap needed - minimum is already at correct position")
        
        print(f"  Array after step {i + 1}: {arr_copy}")
        print(f"  Sorted portion: {arr_copy[:i+1]} | Unsorted portion: {arr_copy[i+1:]}")
    
    print(f"\nFinal sorted array: {arr_copy}")
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
    
    print("=== Selection Sort Test Cases ===\n")
    
    for i, test_arr in enumerate(test_arrays):
        print(f"Test Case {i + 1}:")
        print(f"Original: {test_arr}")
        result = selection_sort(test_arr)
        print(f"Sorted:   {result}")
        print()
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [64, 34, 25, 12, 22, 11, 90]
    selection_sort_verbose(sample_array)