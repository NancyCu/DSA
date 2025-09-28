"""
Bubble Sort Algorithm Implementation

Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through
the list, compares adjacent elements and swaps them if they are in the wrong order.
The pass through the list is repeated until the list is sorted.

Time Complexity:
- Best Case: O(n) - when the array is already sorted
- Average Case: O(n²)
- Worst Case: O(n²) - when the array is reverse sorted

Space Complexity: O(1) - only uses a constant amount of extra space

Stability: Stable - maintains relative order of equal elements
"""

def bubble_sort(arr):
    """
    Sorts an array using the bubble sort algorithm.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: A new sorted list (original list is not modified)
        
    Examples:
        >>> bubble_sort([64, 34, 25, 12, 22, 11, 90])
        [11, 12, 22, 25, 34, 64, 90]
        
        >>> bubble_sort([5, 2, 8, 1, 9])
        [1, 2, 5, 8, 9]
        
        >>> bubble_sort([1])
        [1]
        
        >>> bubble_sort([])
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
        # Flag to optimize: if no swapping occurs, array is sorted
        swapped = False
        
        # Last i elements are already in place, so we don't need to check them
        for j in range(0, n - i - 1):
            # Compare adjacent elements
            if arr_copy[j] > arr_copy[j + 1]:
                # Swap if they are in wrong order
                arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                swapped = True
        
        # If no two elements were swapped, then array is sorted
        if not swapped:
            break
    
    return arr_copy


def bubble_sort_verbose(arr):
    """
    Bubble sort with detailed step-by-step output for educational purposes.
    
    Args:
        arr (list): List of comparable elements to be sorted
        
    Returns:
        list: Sorted list
    """
    arr_copy = arr.copy()
    n = len(arr_copy)
    
    print(f"Starting Bubble Sort with array: {arr_copy}")
    print("-" * 50)
    
    if n <= 1:
        print("Array has 0 or 1 element, already sorted!")
        return arr_copy
    
    for i in range(n):
        print(f"\nPass {i + 1}:")
        swapped = False
        
        for j in range(0, n - i - 1):
            print(f"  Comparing {arr_copy[j]} and {arr_copy[j + 1]}", end="")
            
            if arr_copy[j] > arr_copy[j + 1]:
                print(f" -> Swap needed")
                arr_copy[j], arr_copy[j + 1] = arr_copy[j + 1], arr_copy[j]
                swapped = True
                print(f"  Array after swap: {arr_copy}")
            else:
                print(f" -> No swap needed")
        
        print(f"End of pass {i + 1}: {arr_copy}")
        
        if not swapped:
            print(f"No swaps made in pass {i + 1}, array is sorted!")
            break
    
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
    
    print("=== Bubble Sort Test Cases ===\n")
    
    for i, test_arr in enumerate(test_arrays):
        print(f"Test Case {i + 1}:")
        print(f"Original: {test_arr}")
        result = bubble_sort(test_arr)
        print(f"Sorted:   {result}")
        print()
    
    # Verbose example for educational purposes
    print("\n=== Verbose Example ===")
    sample_array = [64, 34, 25, 12, 22, 11, 90]
    bubble_sort_verbose(sample_array)